import { AliasRule, CodeAnalyzeSettings, CodeElementMetadata, ProjectMetadata, ScannedFile } from "../api/types";
import CodeAnalyzerInterface from "../api/CodeAnalyzerInterface";
import FileAnalyzerInterface from "../spi/FileAnalyzerInterface";
import FileScannerInterface from "../spi/FileScannerInterface";
import ReflectionClass from "../../reflection/core/ReflectionClass";
import ReflectionInterface from "../../reflection/core/ReflectionInterface";
export declare const GET_EMPTY_CODE_ELEMENT_DATA: () => CodeElementMetadata;
export declare type ScanningContext = {
    separator: string;
    rewriteRules: AliasRule[];
};
export default class CodeAnalyzerService implements CodeAnalyzerInterface {
    private readonly analyzer;
    private readonly scanner;
    private readonly subscriber;
    private projectMetadata;
    private inheritanceTree;
    private context;
    constructor(scanner: FileScannerInterface, analyzer: FileAnalyzerInterface);
    private bindServicesTogether;
    analyze({ path, exclude, debug, separator, aliasRules, extensions }: CodeAnalyzeSettings): Promise<ProjectMetadata>;
    private isClassMetadata;
    private isInterfaceMetadata;
    codeElementToReflectionClasses(metaCollection: Record<string, CodeElementMetadata>): ReflectionClass[];
    codeElementToReflectionInterfaces(metaCollection: Record<string, CodeElementMetadata>): ReflectionInterface[];
    protected analyseScannedFile(scannedFile: ScannedFile): void;
}
//# sourceMappingURL=CodeAnalyzerService.d.ts.map