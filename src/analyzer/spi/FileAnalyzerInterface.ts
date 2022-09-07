import {CodeElementMetadata} from "../api/types";
import {ParsingContext} from "./types";

export default interface FileAnalyzerInterface {
    fromContent(code: string, context: ParsingContext): CodeElementMetadata[];
}
