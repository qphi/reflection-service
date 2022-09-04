import {AliasRule} from "../api/types";

export type ParsingContext = {
    filepath?: string,
    separator: string,
    rewriteRules: AliasRule[]
}
