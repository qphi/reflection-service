import {CodeAnalyzeSettings, CodeElementMetadata} from "./types";

export default interface CodeAnalyzerInterface {
    analyze(settings: CodeAnalyzeSettings): Record<string, CodeElementMetadata>;
}
