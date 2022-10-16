"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ReflectionParameter = /** @class */ (function () {
    function ReflectionParameter(_a) {
        var name = _a.name, position = _a.position, defaultValue = _a.defaultValue, type = _a.type, optional = _a.optional, namespace = _a.namespace;
        this.name = name;
        this.position = position;
        this.defaultValue = defaultValue;
        this.optional = optional;
        this.type = type;
        this.namespacedName = namespace !== null && namespace !== void 0 ? namespace : this.name;
    }
    ReflectionParameter.prototype.getName = function () {
        return this.name;
    };
    ReflectionParameter.prototype.getNamespacedName = function () {
        return this.namespacedName;
    };
    ReflectionParameter.prototype.getPosition = function () {
        return this.position;
    };
    ReflectionParameter.prototype.getType = function () {
        return this.type;
    };
    ReflectionParameter.prototype.isDefaultValueAvailable = function () {
        return typeof this.defaultValue !== 'undefined';
    };
    ReflectionParameter.prototype.getDefaultValue = function () {
        return this.defaultValue;
    };
    ReflectionParameter.prototype.isOptional = function () {
        return this.optional;
    };
    return ReflectionParameter;
}());
exports.default = ReflectionParameter;
//# sourceMappingURL=ReflectionParameter.js.map