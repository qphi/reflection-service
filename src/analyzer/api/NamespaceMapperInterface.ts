import {AliasRule} from "../../namespace/api/types";

export default interface NamespaceMapperInterface {
    getNamespacedEntryName(name: string, rules: AliasRule[], separator: string): string;
    getNamespace(entry: string, separator: string): string
}
