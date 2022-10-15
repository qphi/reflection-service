"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NamespaceMapperService = /** @class */ (function () {
    function NamespaceMapperService() {
    }
    NamespaceMapperService.prototype.getNamespacedEntryName = function (name, rules, separator) {
        if (separator === void 0) { separator = '/'; }
        var alias = name;
        rules.forEach(function (rule) {
            alias = alias.replace(rule.replace, rule.by);
        });
        alias = alias.replace(/.(min.)?(js|ts|mjs)/, '').replace(/([-_.][a-z])/ig, function ($1) {
            return $1.toUpperCase()
                .replace('-', '')
                .replace('.', '')
                .replace('_', '');
        });
        return alias.replace(/\\/g, separator);
    };
    NamespaceMapperService.prototype.getNamespace = function (entry, separator) {
        if (separator === void 0) { separator = '/'; }
        var tokens = entry.split(separator);
        tokens.pop();
        return tokens.join(separator);
    };
    return NamespaceMapperService;
}());
exports.default = NamespaceMapperService;
//# sourceMappingURL=NamespaceMapperService.js.map