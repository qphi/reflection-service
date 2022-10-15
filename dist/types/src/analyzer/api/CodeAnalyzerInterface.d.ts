import { CodeAnalyzeSettings, ProjectMetadata } from "./types";
export default interface CodeAnalyzerInterface {
    analyze(settings: CodeAnalyzeSettings): Promise<ProjectMetadata>;
}
//# sourceMappingURL=CodeAnalyzerInterface.d.ts.map