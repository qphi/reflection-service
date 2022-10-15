import {
    AliasRule,
    ClassMetadata,
    CodeAnalyzeSettings,
    CodeElementMetadata,
    InheritanceTree,
    InterfaceMetadata,
    ObjectLocation,
    ParameterMetadata,
    ProjectMetadata,
    ScannedFile
} from "../api/types";
import CodeAnalyzerInterface from "../api/CodeAnalyzerInterface";
import {resolve} from "path";
import FileAnalyzerInterface from "../spi/FileAnalyzerInterface";
import FileScannerInterface, {FILE_CONTENT_AVAILABLE} from "../spi/FileScannerInterface";
import {Subscriber, SubscriberInterface} from "@qphi/publisher-subscriber";
import {randomBytes} from "crypto";
import ReflectionClass from "../../reflection/core/ReflectionClass";
import {buildInheritanceTreeFromClassMetadataCollection, GET_EMPTY_INHERITANCE_TREE} from "./InheritanceTreeService";
import {IS_CLASS, IS_INTERFACE} from "../api/settings";
import ReflectionMethod from "../../reflection/core/ReflectionMethod";
import {ReflectionMethodVisibility} from "../../reflection/api/ReflectionMethodVisibility";
import ReflectionParameter from "../../reflection/core/ReflectionParameter";
import {CONSTRUCTOR_METHOD_NAME} from "../../reflection/api/ReflectionMethodSettings";
import ReflectionInterface from "../../reflection/core/ReflectionInterface";

export const GET_EMPTY_CODE_ELEMENT_DATA = (): CodeElementMetadata => {
    return {
        kind: 'unknown',
        namespace: '',
        name: 'anonymous',
        implements: [] as ObjectLocation[],
        methods: {} as Record<string, any>,
        imports: {} as Record<string, any>,
    } as CodeElementMetadata;
}

export type ScanningContext = {
    separator: string,
    rewriteRules: AliasRule[]
}

export default class CodeAnalyzerService implements CodeAnalyzerInterface {
    private readonly analyzer: FileAnalyzerInterface;
    private readonly scanner: FileScannerInterface;
    private readonly subscriber: SubscriberInterface;

    private projectMetadata: Record<string, CodeElementMetadata> = {};
    private inheritanceTree: InheritanceTree = GET_EMPTY_INHERITANCE_TREE();
    private context: ScanningContext = {
        separator: '.',
        rewriteRules: []
    };

    constructor(scanner: FileScannerInterface, analyzer: FileAnalyzerInterface) {
        this.scanner = scanner;
        this.analyzer = analyzer;

        this.subscriber = new Subscriber('code-analyzer-' + randomBytes(4));
        this.bindServicesTogether();
    }

    private bindServicesTogether(): void {
        this.subscriber.subscribe(
            this.scanner,
            FILE_CONTENT_AVAILABLE,
            (scannedFile: ScannedFile) => {
                this.analyseScannedFile(scannedFile);
            }
        )
    }

    public async analyze({
                             path,
                             exclude = /node_modules/,
                             debug = false,
                             separator = '/',
                             aliasRules = [
                                 {
                                     replace: __dirname,
                                     by: 'App'
                                 }
                             ],
                             extensions = ['ts']
                         }: CodeAnalyzeSettings): Promise<ProjectMetadata> {
        this.context = {
            separator,
            rewriteRules: aliasRules
        };

        this.scanner.scan(
            resolve(path),
            exclude,
            extensions
        );


        // writeFile(
        //     'resolved-meta-class.json',
        //     JSON.stringify(this.projectMetadata, null, 4),
        //     err => {
        //         console.error(err)
        //     }
        // );

        this.inheritanceTree = buildInheritanceTreeFromClassMetadataCollection(this.projectMetadata);

        return {
            interfaces: this.codeElementToReflectionInterfaces(this.projectMetadata),
            classes: this.codeElementToReflectionClasses(this.projectMetadata),
            inheritanceTree: this.inheritanceTree
        };
    }

    private isClassMetadata(meta: CodeElementMetadata): meta is ClassMetadata {
        return meta.kind === IS_CLASS;
    }


    private isInterfaceMetadata(meta: CodeElementMetadata): meta is InterfaceMetadata {
        return meta.kind === IS_INTERFACE;
    }

    public codeElementToReflectionClasses(metaCollection: Record<string, CodeElementMetadata>): ReflectionClass[] {
        const reflectionClasses: ReflectionClass[] = [];
        for (const entry in metaCollection) {
            const meta = metaCollection[entry];
            if (this.isClassMetadata(meta)) {
                const reflectionClass = new ReflectionClass();
                reflectionClass.setName(entry)

                this.inheritanceTree.extendsClass[entry].forEach(className => {
                    reflectionClass.isExtensionOf(className);
                });

                this.inheritanceTree.implementsInterface[entry].forEach(interfaceName => {
                    reflectionClass.isImplementationOf(interfaceName);
                });

                if (meta.abstract) {
                    reflectionClass.setAbstract(true);
                } else {

                    const _constructor = new ReflectionMethod({
                        visibility: ReflectionMethodVisibility.PUBLIC,
                        isStatic: false,
                        isAbstract: false,
                        isConstructor: true,
                        name: CONSTRUCTOR_METHOD_NAME,
                        parameters: meta.constructor.map(parameter => {
                            return new ReflectionParameter(parameter);
                        })
                    });

                    reflectionClass.addMethod(_constructor);
                }

                for (const methodName in meta.methods) {
                    const method = meta.methods[methodName];
                    reflectionClass.addMethod(new ReflectionMethod({
                        visibility: method.visibility,
                        isStatic: method.static,
                        isAbstract: method.abstract,
                        isConstructor: false,
                        parameters: method.parameters.map((parameter: ParameterMetadata) => {
                            return new ReflectionParameter(parameter)
                        }),
                        name: methodName
                    }));
                }

                reflectionClasses.push(reflectionClass);
            }
        }

        return reflectionClasses;
    }



    public codeElementToReflectionInterfaces(metaCollection: Record<string, CodeElementMetadata>): ReflectionInterface[] {
        const reflectionInterfaces: ReflectionInterface[] = [];
        for (const entry in metaCollection) {
            const meta = metaCollection[entry];
            if (this.isInterfaceMetadata(meta)) {
                const reflectionInterface = new ReflectionInterface();
                reflectionInterface.setName(entry)

                this.inheritanceTree.implementsInterface[entry].forEach(interfaceName => {
                    reflectionInterface.isExtensionOf(interfaceName);
                });


                for (const methodName in meta.methods) {
                    const method = meta.methods[methodName];
                    reflectionInterface.addMethod(new ReflectionMethod({
                        visibility: ReflectionMethodVisibility.PUBLIC,
                        isStatic: method.static,
                        isAbstract: true,
                        isConstructor: false,
                        parameters: method.parameters.map((parameter: ParameterMetadata) => {
                            return new ReflectionParameter(parameter)
                        }),
                        name: methodName
                    }));
                }

                reflectionInterfaces.push(reflectionInterface);
            }
        }

        return reflectionInterfaces;
    }

    protected analyseScannedFile(scannedFile: ScannedFile): void {
        const fileMeta: CodeElementMetadata[] = this.analyzer.fromContent(
            scannedFile.content,
            {
                filepath: scannedFile.filePath,
                ...this.context
            }
        );

        fileMeta.forEach(meta => {
            this.projectMetadata[meta.name] = meta;
        });
    }
}
