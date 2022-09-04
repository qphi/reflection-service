import NamespaceMapperInterface from "../api/NamespaceMapperInterface";
import {AliasRule} from "../api/types";

export default class NamespaceMapperService implements NamespaceMapperInterface {
    public getNamespacedEntryName(name: string, rules: AliasRule[], separator: string = '/'): string {
        let alias = name;
        rules.forEach(rule => {
            alias = alias.replace(rule.replace, rule.by);
        });

        alias = alias.replace(/.(min.)?(js|ts|mjs)/, '').replace(/([-_.][a-z])/ig, ($1) => {
            return $1.toUpperCase()
                .replace('-', '')
                .replace('.', '')
                .replace('_', '');
        });

        return alias.replace(/\\/g, separator);
    }


    public getNamespace(entry: string, separator: string = '/'): string {
        const tokens = entry.split(separator);
        tokens.pop();
        return tokens.join(separator);
    }
}
