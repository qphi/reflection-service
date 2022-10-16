"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET_EMPTY_CODE_ELEMENT_DATA = void 0;
var path_1 = require("path");
var FileScannerInterface_1 = require("../spi/FileScannerInterface");
var publisher_subscriber_1 = require("@qphi/publisher-subscriber");
var crypto_1 = require("crypto");
var ReflectionClass_1 = require("../../reflection/core/ReflectionClass");
var InheritanceTreeService_1 = require("./InheritanceTreeService");
var settings_1 = require("../api/settings");
var ReflectionMethod_1 = require("../../reflection/core/ReflectionMethod");
var ReflectionMethodVisibility_1 = require("../../reflection/api/ReflectionMethodVisibility");
var ReflectionParameter_1 = require("../../reflection/core/ReflectionParameter");
var ReflectionMethodSettings_1 = require("../../reflection/api/ReflectionMethodSettings");
var ReflectionInterface_1 = require("../../reflection/core/ReflectionInterface");
var GET_EMPTY_CODE_ELEMENT_DATA = function () {
    return {
        kind: 'unknown',
        namespace: '',
        name: 'anonymous',
        implements: [],
        methods: {},
        imports: {},
    };
};
exports.GET_EMPTY_CODE_ELEMENT_DATA = GET_EMPTY_CODE_ELEMENT_DATA;
var CodeAnalyzerService = /** @class */ (function () {
    function CodeAnalyzerService(scanner, analyzer) {
        this.projectMetadata = {};
        this.inheritanceTree = (0, InheritanceTreeService_1.GET_EMPTY_INHERITANCE_TREE)();
        this.context = {
            separator: '.',
            rewriteRules: []
        };
        this.scanner = scanner;
        this.analyzer = analyzer;
        this.subscriber = new publisher_subscriber_1.Subscriber('code-analyzer-' + (0, crypto_1.randomBytes)(4));
        this.bindServicesTogether();
    }
    CodeAnalyzerService.prototype.bindServicesTogether = function () {
        var _this = this;
        this.subscriber.subscribe(this.scanner, FileScannerInterface_1.FILE_CONTENT_AVAILABLE, function (scannedFile) {
            _this.analyseScannedFile(scannedFile);
        });
    };
    CodeAnalyzerService.prototype.analyze = function (_a) {
        var path = _a.path, _b = _a.exclude, exclude = _b === void 0 ? /node_modules/ : _b, _c = _a.debug, debug = _c === void 0 ? false : _c, _d = _a.separator, separator = _d === void 0 ? '/' : _d, _e = _a.aliasRules, aliasRules = _e === void 0 ? [
            {
                replace: __dirname,
                by: 'App'
            }
        ] : _e, _f = _a.extensions, extensions = _f === void 0 ? ['ts'] : _f;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_g) {
                this.context = {
                    separator: separator,
                    rewriteRules: aliasRules
                };
                this.scanner.scan((0, path_1.resolve)(path), exclude, extensions);
                // writeFile(
                //     'resolved-meta-class.json',
                //     JSON.stringify(this.projectMetadata, null, 4),
                //     err => {
                //         console.error(err)
                //     }
                // );
                this.inheritanceTree = (0, InheritanceTreeService_1.buildInheritanceTreeFromClassMetadataCollection)(this.projectMetadata);
                return [2 /*return*/, {
                        interfaces: this.codeElementToReflectionInterfaces(this.projectMetadata),
                        classes: this.codeElementToReflectionClasses(this.projectMetadata),
                        inheritanceTree: this.inheritanceTree
                    }];
            });
        });
    };
    CodeAnalyzerService.prototype.isClassMetadata = function (meta) {
        return meta.kind === settings_1.IS_CLASS;
    };
    CodeAnalyzerService.prototype.isInterfaceMetadata = function (meta) {
        return meta.kind === settings_1.IS_INTERFACE;
    };
    CodeAnalyzerService.prototype.codeElementToReflectionClasses = function (metaCollection) {
        var reflectionClasses = [];
        var _loop_1 = function (entry) {
            var meta = metaCollection[entry];
            if (this_1.isClassMetadata(meta)) {
                var reflectionClass_1 = new ReflectionClass_1.default();
                var classProvider = function () { return undefined; };
                reflectionClass_1.setName(entry);
                if (meta.export.type === 'export:default') {
                    classProvider = function () { return require(meta.export.path).default; };
                }
                if (meta.export.type === 'export:named') {
                    classProvider = function () { return require(meta.export.path)[meta.name]; };
                }
                reflectionClass_1
                    .setClassProvider(classProvider)
                    .setFilePath(meta.export.path);
                this_1.inheritanceTree.extendsClass[entry].forEach(function (className) {
                    reflectionClass_1.isExtensionOf(className);
                });
                this_1.inheritanceTree.implementsInterface[entry].forEach(function (interfaceName) {
                    reflectionClass_1.isImplementationOf(interfaceName);
                });
                if (meta.abstract) {
                    reflectionClass_1.setAbstract(true);
                }
                else {
                    var _constructor = new ReflectionMethod_1.default({
                        visibility: ReflectionMethodVisibility_1.ReflectionMethodVisibility.PUBLIC,
                        isStatic: false,
                        isAbstract: false,
                        isConstructor: true,
                        name: ReflectionMethodSettings_1.CONSTRUCTOR_METHOD_NAME,
                        parameters: meta.constructor.map(function (parameter) {
                            return new ReflectionParameter_1.default(parameter);
                        })
                    });
                    reflectionClass_1.addMethod(_constructor);
                }
                for (var methodName in meta.methods) {
                    var method = meta.methods[methodName];
                    reflectionClass_1.addMethod(new ReflectionMethod_1.default({
                        visibility: method.visibility,
                        isStatic: method.static,
                        isAbstract: method.abstract,
                        isConstructor: false,
                        parameters: method.parameters.map(function (parameter) {
                            return new ReflectionParameter_1.default(parameter);
                        }),
                        name: methodName
                    }));
                }
                reflectionClasses.push(reflectionClass_1);
            }
        };
        var this_1 = this;
        for (var entry in metaCollection) {
            _loop_1(entry);
        }
        return reflectionClasses;
    };
    CodeAnalyzerService.prototype.codeElementToReflectionInterfaces = function (metaCollection) {
        var reflectionInterfaces = [];
        var _loop_2 = function (entry) {
            var meta = metaCollection[entry];
            if (this_2.isInterfaceMetadata(meta)) {
                var reflectionInterface_1 = new ReflectionInterface_1.default();
                reflectionInterface_1.setName(entry);
                this_2.inheritanceTree.implementsInterface[entry].forEach(function (interfaceName) {
                    reflectionInterface_1.isExtensionOf(interfaceName);
                });
                for (var methodName in meta.methods) {
                    var method = meta.methods[methodName];
                    reflectionInterface_1.addMethod(new ReflectionMethod_1.default({
                        visibility: ReflectionMethodVisibility_1.ReflectionMethodVisibility.PUBLIC,
                        isStatic: method.static,
                        isAbstract: true,
                        isConstructor: false,
                        parameters: method.parameters.map(function (parameter) {
                            return new ReflectionParameter_1.default(parameter);
                        }),
                        name: methodName
                    }));
                }
                reflectionInterfaces.push(reflectionInterface_1);
            }
        };
        var this_2 = this;
        for (var entry in metaCollection) {
            _loop_2(entry);
        }
        return reflectionInterfaces;
    };
    CodeAnalyzerService.prototype.analyseScannedFile = function (scannedFile) {
        var _this = this;
        var fileMeta = this.analyzer.fromContent(scannedFile.content, __assign({ filepath: scannedFile.filePath }, this.context));
        fileMeta.forEach(function (meta) {
            _this.projectMetadata[meta.name] = meta;
        });
    };
    return CodeAnalyzerService;
}());
exports.default = CodeAnalyzerService;
//# sourceMappingURL=CodeAnalyzerService.js.map