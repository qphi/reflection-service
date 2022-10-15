"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ReflectionMethodVisibility_1 = require("../api/ReflectionMethodVisibility");
var ReflectionMethod = /** @class */ (function () {
    function ReflectionMethod(_a) {
        var visibility = _a.visibility, isStatic = _a.isStatic, isAbstract = _a.isAbstract, isConstructor = _a.isConstructor, parameters = _a.parameters, name = _a.name;
        this.visibility = visibility;
        this._isStatic = isStatic;
        this._isAbstract = isAbstract;
        this._isConstructor = isConstructor;
        this.name = name;
        this.parameters = parameters;
    }
    ReflectionMethod.prototype.getName = function () {
        return this.name;
    };
    ReflectionMethod.prototype.isAbstract = function () {
        return this._isAbstract;
    };
    ReflectionMethod.prototype.isConstructor = function () {
        return this._isConstructor;
    };
    ReflectionMethod.prototype.isPrivate = function () {
        return this.visibility === ReflectionMethodVisibility_1.ReflectionMethodVisibility.PRIVATE;
    };
    ReflectionMethod.prototype.isProtected = function () {
        return this.visibility === ReflectionMethodVisibility_1.ReflectionMethodVisibility.PROTECTED;
    };
    ReflectionMethod.prototype.isPublic = function () {
        return this.visibility === ReflectionMethodVisibility_1.ReflectionMethodVisibility.PUBLIC;
    };
    ReflectionMethod.prototype.isStatic = function () {
        return this._isStatic;
    };
    ReflectionMethod.prototype.getParameters = function () {
        return this.parameters;
    };
    ReflectionMethod.prototype.getParameter = function (name) {
        var parameter = this.parameters.find(function (parameter) { return parameter.getName() === name; });
        if (!parameter) {
            // todo inject name + dedicated error
            throw "Unable to find parameter \"".concat(name, "\" in method \"\"");
        }
        return parameter;
    };
    return ReflectionMethod;
}());
exports.default = ReflectionMethod;
//# sourceMappingURL=ReflectionMethod.js.map