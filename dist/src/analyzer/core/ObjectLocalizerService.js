"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ObjectLocalizerService = /** @class */ (function () {
    function ObjectLocalizerService() {
    }
    ObjectLocalizerService.prototype.resolveLocalImport = function (entry, _imports, currentNamespace) {
        var importedObjectLocation = _imports.find(function (location) { return location.name === entry; });
        var location = {
            name: entry,
            namespace: ''
        };
        if (importedObjectLocation) {
            location.namespace = importedObjectLocation.namespace;
        }
        else {
            location.namespace = "".concat(currentNamespace, "::").concat(entry);
        }
        return location;
    };
    return ObjectLocalizerService;
}());
exports.default = ObjectLocalizerService;
//# sourceMappingURL=ObjectLocalizerService.js.map