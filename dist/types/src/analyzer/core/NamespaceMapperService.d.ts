import NamespaceMapperInterface from "../api/NamespaceMapperInterface";
import { AliasRule } from "../api/types";
export default class NamespaceMapperService implements NamespaceMapperInterface {
    getNamespacedEntryName(name: string, rules: AliasRule[], separator?: string): string;
    getNamespace(entry: string, separator?: string): string;
}
//# sourceMappingURL=NamespaceMapperService.d.ts.map