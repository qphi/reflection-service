"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ReflectionParameter = /** @class */ (function () {
    function ReflectionParameter(_a) {
        var name = _a.name, position = _a.position, defaultValue = _a.defaultValue, optional = _a.optional;
        this.name = name;
        this.position = position;
        this.defaultValue = defaultValue;
        this.optional = optional;
    }
    ReflectionParameter.prototype.getName = function () {
        return this.name;
    };
    ReflectionParameter.prototype.getPosition = function () {
        return this.position;
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