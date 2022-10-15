import FileAnalyzerInterface from "../spi/FileAnalyzerInterface";
import { CodeElementMetadata } from "../api/types";
import NamespaceMapperInterface from "../api/NamespaceMapperInterface";
import { ParsingContext } from "../spi/types";
import ObjectLocalizerInterface from "../api/ObjectLocalizerInterface";
export default class BabelParserFileAnalyzer implements FileAnalyzerInterface {
    private readonly namespaceMapper;
    private readonly localizer;
    private readonly parameterParser;
    constructor(namespaceMapper: NamespaceMapperInterface, localizer: ObjectLocalizerInterface);
    private getProgram;
    fromContent(code: string, context: ParsingContext): CodeElementMetadata[];
    private getFinalEntryName;
}
//# sourceMappingURL=BabelParserFileAnalyzer.d.ts.map