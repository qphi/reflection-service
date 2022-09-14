import {AliasRule} from "./types";


export default interface NamespaceMapperInterface {
    getNamespacedEntryName(name: string, rules: AliasRule[], separator: string): string;
    getNamespace(entry: string, separator: string): string
}
