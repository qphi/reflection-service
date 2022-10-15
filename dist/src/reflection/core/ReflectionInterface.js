"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var publisher_subscriber_1 = require("@qphi/publisher-subscriber");
var ReflectionInterface = /** @class */ (function () {
    function ReflectionInterface() {
        this.methods = [];
        this.extendedInterfacesName = new Set();
        this.name = '';
    }
    ReflectionInterface.prototype.setName = function (name) {
        this.name = name;
        return this;
    };
    ReflectionInterface.prototype.getName = function () {
        return this.name;
    };
    ReflectionInterface.prototype.addMethod = function (method) {
        this.methods.push(method);
        return this;
    };
    ReflectionInterface.prototype.setMethods = function (methods) {
        this.methods = methods;
        return this;
    };
    ReflectionInterface.prototype.isExtensionOf = function (interfaceName) {
        this.extendedInterfacesName.add(interfaceName);
        return this;
    };
    ReflectionInterface.prototype.extends = function (className) {
        return this.extendedInterfacesName.has(className);
    };
    ReflectionInterface.prototype.getMethod = function (methodName) {
        var method = this.methods.find(function (reflectionMethod) { return reflectionMethod.getName() === methodName; });
        if (typeof method === 'undefined') {
            throw new publisher_subscriber_1.InvalidArgumentException("No method \"".concat(methodName, "\" found in interface \"").concat(this.getName(), "\""));
        }
        return method;
    };
    ReflectionInterface.prototype.getMethods = function () {
        return this.methods;
    };
    return ReflectionInterface;
}());
exports.default = ReflectionInterface;
//# sourceMappingURL=ReflectionInterface.js.map