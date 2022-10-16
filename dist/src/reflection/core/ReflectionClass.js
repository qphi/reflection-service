"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var publisher_subscriber_1 = require("@qphi/publisher-subscriber");
var ReflectionClass = /** @class */ (function () {
    function ReflectionClass() {
        this.methods = [];
        this.implementedInterfacesName = new Set();
        this.extendedClassesName = new Set();
        this._isAbstract = false;
        this.filePath = '';
        this.name = '';
        this.classProvider = function () { return undefined; };
    }
    ReflectionClass.prototype.setName = function (name) {
        this.name = name;
        return this;
    };
    ReflectionClass.prototype.getClass = function () {
        return this.classProvider();
    };
    ReflectionClass.prototype.setClassProvider = function (provider) {
        this.classProvider = provider;
        return this;
    };
    ReflectionClass.prototype.getName = function () {
        return this.name;
    };
    ReflectionClass.prototype.setAbstract = function (value) {
        this._isAbstract = value;
        return this;
    };
    ReflectionClass.prototype.addMethod = function (method) {
        this.methods.push(method);
        return this;
    };
    ReflectionClass.prototype.setMethods = function (methods) {
        this.methods = methods;
        return this;
    };
    ReflectionClass.prototype.isImplementationOf = function (interfaceName) {
        this.implementedInterfacesName.add(interfaceName);
        return this;
    };
    ReflectionClass.prototype.isExtensionOf = function (className) {
        this.extendedClassesName.add(className);
        return this;
    };
    ReflectionClass.prototype.implements = function (interfaceName) {
        return this.implementedInterfacesName.has(interfaceName);
    };
    ReflectionClass.prototype.extends = function (className) {
        return this.extendedClassesName.has(className);
    };
    ReflectionClass.prototype.getMethod = function (methodName) {
        var method = this.methods.find(function (reflectionMethod) { return reflectionMethod.getName() === methodName; });
        if (typeof method === 'undefined') {
            throw new publisher_subscriber_1.InvalidArgumentException("No method \"".concat(methodName, "\" found in class \"").concat(this.getName(), "\""));
        }
        return method;
    };
    ReflectionClass.prototype.hasMethod = function (methodName) {
        var method = this.methods.find(function (reflectionMethod) { return reflectionMethod.getName() === methodName; });
        return typeof method !== 'undefined';
    };
    ReflectionClass.prototype.getMethods = function () {
        return this.methods;
    };
    ReflectionClass.prototype.isAbstract = function () {
        return this._isAbstract;
    };
    ReflectionClass.prototype.getFilePath = function () {
        return this.filePath;
    };
    ReflectionClass.prototype.setFilePath = function (filePath) {
        this.filePath = filePath;
        return this;
    };
    return ReflectionClass;
}());
exports.default = ReflectionClass;
//# sourceMappingURL=ReflectionClass.js.map