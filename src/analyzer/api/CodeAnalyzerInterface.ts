import {CodeAnalyzeSettings, CodeElementMetadata} from "./types";

export default interface CodeAnalyzerInterface {
    analyze(settings: CodeAnalyzeSettings): Promise<Record<string, CodeElementMetadata>>;
}
