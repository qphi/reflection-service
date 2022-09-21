import {CodeAnalyzeSettings} from "./types";
import ReflectionClassInterface from "../../reflection/api/ReflectionClassInterface";

export default interface CodeAnalyzerInterface {
    analyze(settings: CodeAnalyzeSettings): Promise<ReflectionClassInterface[]>;
}
