import FileAnalyzerInterface from "../spi/FileAnalyzerInterface";
import {CodeElementMetadata} from "../api/types";
import {parse, ParseResult} from "@babel/parser";
import {writeFile} from "fs";
import {resolve} from "path";
import type {ClassMethod, File, Program, TSExpressionWithTypeArguments, TSMethodSignature} from '@babel/types';
import NamespaceMapperInterface from "../../namespace/api/NamespaceMapperInterface";
import {ParsingContext} from "../spi/types";

export default class BabelParserFileAnalyzer implements FileAnalyzerInterface {
    private readonly namespaceMapper: NamespaceMapperInterface;
    constructor(namespaceMapper: NamespaceMapperInterface) {
        this.namespaceMapper = namespaceMapper;
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

    public fromContent(code: string, context: ParsingContext): CodeElementMetadata {
        const fileNode = this.getProgram(code);

        const entryName = this.namespaceMapper.getNamespacedEntryName(
            context.filepath ?? '',
            context.rewriteRules,
            context.separator
        );

        const programNode: Program = fileNode.program;
        // if (debug === true && entryName === "App/src/HandlerB") {
        //     writeFile(
        //         'program.json',
        //         JSON.stringify(programNode, null, 4),
        //         err => {
        //             console.error(err)
        //         }
        //     );
        // }

        const allClassDeclarationNodes: ClassDeclarationWrapper[] = findClassDefinitionsInProgram(programNode);
        const hasMultipleDeclarationInProgram = allClassDeclarationNodes.length > 1;

        allClassDeclarationNodes.forEach(classDeclarationWrapper => {
            const classDeclarationNode = classDeclarationWrapper.node;

            const classMeta: ClassMetadata = {
                kind: IS_CLASS,
                namespace: getNamespaceFromNamespacedEntry(entryName, separator),
                name: classDeclarationNode.id.name,
                superClass: null,
                abstract: classDeclarationNode.abstract ?? false,
                implements: [],
                constructor: [],
                methods: {},
                imports: retrieveImportsFromProgramNode(programNode),
                export: {
                    path: element.path,
                    type: 'default'
                }
            };

            // rewrite local import path by their namespace
            if (classMeta.namespace?.length > 1) {
                classMeta.imports.forEach((_import, index) => {
                    // Path is absolute (add it to path helper)
                    // if (resolve(_import.path) == path.normalize(_import.path)) {
                    //     // do some stuff
                    // } else {
                    _import.namespace = getNamespacedEntry(
                        resolve(element.path, '../', _import.namespace),
                        aliasRules,
                        separator
                    );
                });
            }

            if (
                classDeclarationNode.superClass !== null &&
                typeof classDeclarationNode.superClass !== 'undefined' &&
                'name' in classDeclarationNode.superClass
            ) {
                classMeta.superClass = resolveLocalResourceLocation(
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
                        classMeta.implements.push(resolveLocalResourceLocation(
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
                            return retrieveParameterMetadataFromNode(param, parser, index, classMeta.imports);
                        });

                        classMeta.constructor = parameters;
                    } else if (node.kind === 'method') {
                        let nodeName = '';

                        if ("name" in node.key) {
                            nodeName = node.key.name;
                        }

                        const methodMeta: MethodMetadata = {
                            visibility: ReflexionMethodVisibility.PUBLIC, // todo
                            abstract: false, // todo
                            static: node.static,
                            computed: node.computed,
                            async: node.async,
                            name: nodeName,
                            parameters: node.params.map((param, index) => {
                                return retrieveParameterMetadataFromNode(param, parser, index, classMeta.imports);
                            }),

                            returnType: node.returnType ? parser.retrieveTypeFromNode(node.returnType) : 'unknown'
                        };

                        classMeta.methods[methodMeta.name] = methodMeta;
                    }
                });

            const finalEntryName = getFinalEntryName(entryName, hasMultipleDeclarationInProgram, classMeta);
            projectMetadata[finalEntryName] = classMeta;
        });

        const interfaceDeclarationNodes = findInterfaceDefinitionInProgram(programNode);

        interfaceDeclarationNodes.forEach(interfaceDeclaration => {
            const interfaceNode = interfaceDeclaration.node;

            const interfaceMeta: InterfaceMetadata = {
                kind: IS_INTERFACE,
                namespace: getNamespaceFromNamespacedEntry(entryName, separator),
                name: interfaceNode.id.name,
                implements: [],
                methods: {},
                imports: retrieveImportsFromProgramNode(programNode),
                export: {
                    path: element.path,
                    type: 'default'
                }
            };

            // rewrite local import path by their namespace
            if (interfaceMeta.namespace?.length > 1) {
                interfaceMeta.imports.forEach((_import, index) => {
                    // Path is absolute (add it to path helper)
                    // if (resolve(_import.path) == path.normalize(_import.path)) {
                    //     // do some stuff
                    // } else {
                    _import.namespace = getNamespacedEntry(
                        resolve(element.path, '../', _import.namespace),
                        aliasRules,
                        separator
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
                        interfaceMeta.implements.push(resolveLocalResourceLocation(
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
                            visibility: ReflexionMethodVisibility.PUBLIC, // todo
                            static: false,
                            computed: node.computed ?? false,
                            async: false, // todo effectuer un test sur le type de retour
                            name: nodeName,
                            parameters: node.parameters.map((param, index) => {
                                return retrieveParameterMetadataFromNode(param, parser, index);
                            }),

                            returnType: 'unknown until babel 8.0'
                        };

                        interfaceMeta.methods[methodMeta.name] = methodMeta;
                    }
                });

            const finalEntryName = getFinalEntryName(entryName, hasMultipleDeclarationInProgram, interfaceMeta);
            projectMetadata[finalEntryName] = interfaceMeta;
        });
    }

);

}
}
