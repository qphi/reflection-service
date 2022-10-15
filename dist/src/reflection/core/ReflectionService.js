"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// https://stackoverflow.com/questions/39392853/is-there-a-type-for-class-in-typescript-and-does-any-include-it
var settings_1 = require("../../analyzer/api/settings");
var publisher_subscriber_1 = require("@qphi/publisher-subscriber");
var ReflectionClass_1 = require("./ReflectionClass");
var ReflectionService = /** @class */ (function () {
    function ReflectionService(classes, interfaces) {
        var _this = this;
        // private inheritanceTree: InheritanceTree = GET_EMPTY_INHERITANCE_TREE();
        this.dictionary = new Map();
        this.typeToNamespaceMapping = new Map();
        this.reflectionClasses = {};
        this.reflectionInterfaces = {};
        classes.forEach(function (_class) {
            _this.addReflectionClass(_class);
        });
        interfaces.forEach(function (_interface) {
            _this.addReflectionInterface(_interface);
        });
        // this.setInheritanceTree(inheritanceTree);
    }
    ReflectionService.prototype.recordClass = function (name, theClass, meta) {
        this.dictionary.set(name, theClass);
        this.typeToNamespaceMapping.set(theClass, name);
        if (meta) {
            this.reflectionClasses[name] = meta;
        }
        else {
            if (typeof this.reflectionClasses[name] === 'undefined') {
                this.reflectionClasses[name] = (new ReflectionClass_1.default()).setName(name);
            }
        }
        return this;
    };
    ReflectionService.prototype.addReflectionClass = function (reflectionClass) {
        this.reflectionClasses[reflectionClass.getName()] = reflectionClass;
        return this;
    };
    ReflectionService.prototype.addReflectionInterface = function (reflectionInterface) {
        this.reflectionInterfaces[reflectionInterface.getName()] = reflectionInterface;
        return this;
    };
    ReflectionService.prototype.getReflectionClass = function (name) {
        var _class = this.reflectionClasses[name];
        if (_class === null) {
            throw new publisher_subscriber_1.InvalidArgumentException("Unable to find ReflectionClass for class \"".concat(name, "\""));
        }
        return _class;
    };
    ReflectionService.prototype.getReflectionInterface = function (name) {
        var _interface = this.reflectionInterfaces[name];
        if (_interface === null) {
            throw new publisher_subscriber_1.InvalidArgumentException("Unable to find ReflectionInterface for interface \"".concat(name, "\""));
        }
        return _interface;
    };
    ReflectionService.prototype.getReflectionInterfaces = function () {
        return Object.values(this.reflectionInterfaces);
    };
    ReflectionService.prototype.getReflectionClasses = function () {
        return Object.values(this.reflectionClasses);
    };
    ReflectionService.prototype.getReflectionMethod = function (resourceType, methodName) {
        var namespacedResourceName = this.getNamespacedResourceName(resourceType);
        if (namespacedResourceName === null) {
            // todo throw dedicated error
            throw "Cannot find method \"".concat(methodName, "\" of resource \"").concat(resourceType.constructor.name, "\". No namespace was bind to this resource.");
        }
        try {
            var reflectionClass = this.getReflectionClass(namespacedResourceName);
            return reflectionClass.getMethod(methodName);
        }
        catch (error) {
            if (error instanceof publisher_subscriber_1.InvalidArgumentException) {
                error.message += " Resolved from \"".concat(resourceType, "\" class name.");
            }
            throw error;
        }
    };
    // public setInheritanceTree(tree: InheritanceTree): void {
    //     this.inheritanceTree = tree;
    // }
    ReflectionService.prototype.getImplementationsOf = function (interfaceName) {
        return Object.values(this.reflectionClasses).filter(function (_class) { return _class.implements(interfaceName); });
    };
    ReflectionService.prototype.findClass = function (className) {
        switch (className) {
            case 'Object':
                return Object;
            default:
                var candidate = this.dictionary.get(className);
                return this.reflectionClasses[className] ? candidate : undefined;
        }
    };
    ReflectionService.prototype.isInterface = function (namespacedResourceName) {
        return typeof this.reflectionInterfaces[namespacedResourceName] !== 'undefined';
    };
    ReflectionService.prototype.isClass = function (namespacedResourceName) {
        return typeof this.reflectionClasses[namespacedResourceName] !== 'undefined';
    };
    ReflectionService.prototype.isKindOf = function (namespacedResourceName, kind) {
        switch (kind) {
            case settings_1.IS_INTERFACE:
                return typeof this.reflectionInterfaces[namespacedResourceName] !== 'undefined';
            case settings_1.IS_CLASS:
                return typeof this.reflectionClasses[namespacedResourceName] !== 'undefined';
            default:
                return false;
        }
        ;
    };
    ReflectionService.prototype.getNamespacedResourceName = function (resourceType) {
        var _a;
        return (_a = this.typeToNamespaceMapping.get(resourceType)) !== null && _a !== void 0 ? _a : null;
    };
    /**
     * Inspired from: https://davidwalsh.name/javascript-arguments
     * @param func
     */
    ReflectionService.prototype.getFunctionArgumentsName = function (func) {
        return this.parseFunctionDefinition(func.toString());
    };
    ReflectionService.prototype.parseFunctionDefinition = function (functionDefinition) {
        var tokens = functionDefinition.match(/function\s.*?\(([^)]*)\)/) || [];
        if (tokens.length < 1) {
            return tokens;
        }
        var name = tokens[0];
        var args = tokens[1];
        // Split the arguments string into an array comma delimited.
        return [name].concat(args.split(',').map(function (arg) {
            // Ensure no inline comments are parsed and trim the whitespace.
            return arg.replace(/\/\*.*\*\//, '').trim();
        }).filter(function (arg) {
            // Ensure no undefined values are added.
            return arg;
        }));
    };
    return ReflectionService;
}());
exports.default = ReflectionService;
//# sourceMappingURL=ReflectionService.js.map