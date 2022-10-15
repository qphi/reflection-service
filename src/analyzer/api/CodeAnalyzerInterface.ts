import {CodeAnalyzeSettings, ProjectMetadata} from "./types";

export default interface CodeAnalyzerInterface {
    analyze(settings: CodeAnalyzeSettings): Promise<ProjectMetadata>;
}
