import CodeAnalyzerService from "../analyzer/core/CodeAnalyzerService";
import DreeFileScanner from "../analyzer/infrastructure/DreeFileScanner";
import BabelParserFileAnalyzer from "../analyzer/infrastructure/BabelParserFileAnalyzer";
import NamespaceMapperService from "../analyzer/core/NamespaceMapperService";
import ObjectLocalizerService from "../analyzer/core/ObjectLocalizerService";

export default class ProjectAnalyzer extends CodeAnalyzerService {
    constructor() {
        super(
            new DreeFileScanner(),
            new BabelParserFileAnalyzer(
                new NamespaceMapperService(),
                new ObjectLocalizerService()
            )
        );
    }
}
