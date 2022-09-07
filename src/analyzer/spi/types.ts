import {AliasRule} from "../api/types";
import type {ClassDeclaration, TSInterfaceDeclaration} from '@babel/types';

export type ParsingContext = {
    filepath: string,
    separator: string,
    rewriteRules: AliasRule[]
}

