import FileAnalyzerInterface from "../spi/FileAnalyzerInterface";
import {
    ClassMetadata,
    CodeElementMetadata,
    InterfaceMetadata,
    MethodMetadata,
    ObjectLocation,
    ParameterMetadata
} from "../api/types";
import {parse, ParseResult} from "@babel/parser";
import {resolve} from "path";
import type {ClassMethod, File, Program, TSExpressionWithTypeArguments, TSMethodSignature} from '@babel/types';
import NamespaceMapperInterface from "../api/NamespaceMapperInterface";
import {ClassDeclarationWrapper} from "../infrastructure/types";
import {ParsingContext} from "../spi/types";
import {
    getClassDeclarationFromProgramNode,
    getInstanceTypeNameFromNode,
    getInterfaceDefinitionInProgram,
    retrieveImportsFromProgramNode
} from "./BabelAstHelper";
import {IS_CLASS, IS_INTERFACE} from "../api/settings";
import ObjectLocalizerInterface from "../api/ObjectLocalizerInterface";
import {ReflectionMethodVisibility} from "../../reflection/api/ReflectionMethodVisibility";
import ParameterBabelAstAnalyzer from "./ParameterBabelAstAnalyzer";

export default class BabelParserFileAnalyzer implements FileAnalyzerInterface {
    private readonly namespaceMapper: NamespaceMapperInterface;
    private readonly localizer: ObjectLocalizerInterface;
    private readonly parameterParser = new ParameterBabelAstAnalyzer();

    constructor(
        namespaceMapper: NamespaceMapperInterface,
        localizer: ObjectLocalizerInterface
    ) {
        this.namespaceMapper = namespaceMapper;
        this.localizer = localizer;
    }

    private getProgram(code: string): ParseResult<File> {
        return parse(
            code,
            {
                sourceType: 'module',
                plugins: [
                    'typescript'
                ]
            }
        );
    }

    public fromContent(code: string, context: ParsingContext): CodeElementMetadata[] {
        const codeElementMetadata: CodeElementMetadata[] = [];
        const fileNode = this.getProgram(code);

        const entryName = this.namespaceMapper.getNamespacedEntryName(
            context.filepath,
            context.rewriteRules,
            context.separator
        );

        const programNode: Program = fileNode.program;
        const allClassDeclarationNodes: ClassDeclarationWrapper[] = getClassDeclarationFromProgramNode(programNode);
        const hasMultipleDeclarationInProgram = allClassDeclarationNodes.length > 1;

        allClassDeclarationNodes.forEach(classDeclarationWrapper => {
            const classDeclarationNode = classDeclarationWrapper.node;

            const classMeta = {
                kind: IS_CLASS,
                namespace: this.namespaceMapper.getNamespace(entryName, context.separator),
                name: classDeclarationNode.id.name,
                superClass: null,
                abstract: classDeclarationNode.abstract ?? false,
                implements: [],
                constructor: [] as ParameterMetadata[],
                methods: {},
                imports: retrieveImportsFromProgramNode(programNode),
                export: {
                    path: context.filepath,
                    type: 'default'
                }
            } as ClassMetadata;

            // rewrite local import path by their namespace
            if (classMeta.namespace?.length > 1) {
                classMeta.imports.forEach((_import: ObjectLocation, index: number) => {
                    // Path is absolute (add it to path helper)
                    // if (resolve(_import.path) == path.normalize(_import.path)) {
                    //     // do some stuff
                    // } else {
                    _import.namespace = this.namespaceMapper.getNamespacedEntryName(
                        resolve(context.filepath, '../', _import.namespace),
                        context.rewriteRules,
                        context.separator
                    );
                });
            }

            if (
                classDeclarationNode.superClass !== null &&
                typeof classDeclarationNode.superClass !== 'undefined' &&
                'name' in classDeclarationNode.superClass
            ) {
                classMeta.superClass = this.localizer.resolveLocalImport(
                    classDeclarationNode.superClass.name,
                    classMeta.imports,
                    entryName
                );
            }

            if (classDeclarationWrapper.parentNodeType === 'ExportDefaultDeclaration') {
                classMeta.export.type = 'export:default';
            } else if (classDeclarationWrapper.parentNodeType === 'ExportNamedDeclaration') {
                classMeta.export.type = 'export:named';
            } else {
                classMeta.export.type = 'inline';
            }


            classDeclarationNode?.implements?.forEach(node => {
                if (node.type === 'TSExpressionWithTypeArguments') {
                    const expression = (node as TSExpressionWithTypeArguments).expression;
                    if ("name" in expression) {
                        classMeta.implements.push(
                            this.localizer.resolveLocalImport(
                                expression.name,
                                classMeta.imports,
                                entryName
                            ));
                    }
                }
            });


            classDeclarationNode.body.body.filter(node => node.type === 'ClassMethod').forEach(
                (node: ClassMethod) => {
                    if (node.kind === 'constructor') {
                        // const parameters = parser.retrieveSignature(node, classMeta.imports).parameters;
                        const parameters = node.params.map((param, index) => {
                            return this.parameterParser.parse(param, index, classMeta.imports);
                        });

                        (classMeta.constructor as ParameterMetadata[]) = parameters;
                    } else if (node.kind === 'method') {
                        let nodeName = '';

                        if ("name" in node.key) {
                            nodeName = node.key.name;
                        }

                        const methodMeta: MethodMetadata = {
                            visibility: ReflectionMethodVisibility.PUBLIC, // todo
                            abstract: false, // todo
                            static: node.static,
                            computed: node.computed,
                            async: node.async,
                            name: nodeName,
                            parameters: node.params.map((param, index) => {
                                return this.parameterParser.parse(param, index, classMeta.imports);
                            }),

                            returnType: node.returnType
                                ? getInstanceTypeNameFromNode(node.returnType)
                                : 'unknown'
                        };

                        classMeta.methods[methodMeta.name] = methodMeta;
                    }
                });

            classMeta.name = this.getFinalEntryName(entryName, hasMultipleDeclarationInProgram, classMeta);
            codeElementMetadata.push(classMeta);
        });

        const interfaceDeclarationNodes = getInterfaceDefinitionInProgram(programNode);

        interfaceDeclarationNodes.forEach(interfaceDeclaration => {
            const interfaceNode = interfaceDeclaration.node;

            const interfaceMeta: InterfaceMetadata = {
                kind: IS_INTERFACE,
                namespace: this.namespaceMapper.getNamespace(entryName, context.separator),
                name: interfaceNode.id.name,
                implements: [],
                methods: {},
                imports: retrieveImportsFromProgramNode(programNode),
                export: {
                    path: context.filepath,
                    type: 'default'
                }
            };

            // rewrite local import path by their namespace
            if (interfaceMeta.namespace?.length > 1) {
                interfaceMeta.imports.forEach((_import:ObjectLocation, index: number) => {
                    // Path is absolute (add it to path helper)
                    // if (resolve(_import.path) == path.normalize(_import.path)) {
                    //     // do some stuff
                    // } else {
                    _import.namespace = this.namespaceMapper.getNamespacedEntryName(
                        resolve(context.filepath, '../', _import.namespace),
                        context.rewriteRules,
                        context.separator
                    );
                });
            }


            if (interfaceDeclaration.parentNodeType === 'ExportDefaultDeclaration') {
                interfaceMeta.export.type = 'export:default';
            } else if (interfaceDeclaration.parentNodeType === 'ExportNamedDeclaration') {
                interfaceMeta.export.type = 'export:named';
            } else {
                interfaceMeta.export.type = 'inline';
            }


            interfaceNode?.extends?.forEach(node => {
                if (node.type === 'TSExpressionWithTypeArguments') {
                    const expression = (node as TSExpressionWithTypeArguments).expression;
                    if ("name" in expression) {
                        interfaceMeta.implements.push(this.localizer.resolveLocalImport(
                            expression.name,
                            interfaceMeta.imports,
                            entryName
                        ));
                    }
                }
            });


            interfaceNode.body.body.filter(node => node.type === 'TSMethodSignature').forEach(
                (node: TSMethodSignature) => {
                    if (node.kind === 'method') {
                        let nodeName = '';

                        if ("name" in node.key) {
                            nodeName = node.key.name;
                        }

                        const methodMeta: MethodMetadata = {
                            abstract: false, // todo
                            visibility: ReflectionMethodVisibility.PUBLIC, // todo
                            static: false,
                            computed: node.computed ?? false,
                            async: false, // todo effectuer un test sur le type de retour
                            name: nodeName,
                            parameters: node.parameters.map((param, index) => {
                                return this.parameterParser.parse(param, index);
                            }),

                            returnType: 'unknown until babel 8.0'
                        };

                        interfaceMeta.methods[methodMeta.name] = methodMeta;
                    }
                });

            interfaceMeta.name = this.getFinalEntryName(entryName, hasMultipleDeclarationInProgram, interfaceMeta);
            codeElementMetadata.push(interfaceMeta);
        });

        return codeElementMetadata;
    }

    private getFinalEntryName(entryName: string, hasMultipleDeclarationInProgram: boolean, meta: CodeElementMetadata): string {
        return entryName + (
            (hasMultipleDeclarationInProgram && meta.export.type !== 'export:default')
                ? `::${meta.name.toLowerCase()}`
                : ''
        );
    }
}
