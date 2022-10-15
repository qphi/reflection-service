"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parser_1 = require("@babel/parser");
var path_1 = require("path");
var BabelAstHelper_1 = require("./BabelAstHelper");
var settings_1 = require("../api/settings");
var ReflectionMethodVisibility_1 = require("../../reflection/api/ReflectionMethodVisibility");
var ParameterBabelAstAnalyzer_1 = require("./ParameterBabelAstAnalyzer");
var BabelParserFileAnalyzer = /** @class */ (function () {
    function BabelParserFileAnalyzer(namespaceMapper, localizer) {
        this.parameterParser = new ParameterBabelAstAnalyzer_1.default();
        this.namespaceMapper = namespaceMapper;
        this.localizer = localizer;
    }
    BabelParserFileAnalyzer.prototype.getProgram = function (code) {
        return (0, parser_1.parse)(code, {
            sourceType: 'module',
            plugins: [
                'typescript'
            ]
        });
    };
    BabelParserFileAnalyzer.prototype.fromContent = function (code, context) {
        var _this = this;
        var codeElementMetadata = [];
        var fileNode = this.getProgram(code);
        var entryName = this.namespaceMapper.getNamespacedEntryName(context.filepath, context.rewriteRules, context.separator);
        var programNode = fileNode.program;
        var allClassDeclarationNodes = (0, BabelAstHelper_1.getClassDeclarationFromProgramNode)(programNode);
        var hasMultipleDeclarationInProgram = allClassDeclarationNodes.length > 1;
        allClassDeclarationNodes.forEach(function (classDeclarationWrapper) {
            var _a, _b, _c;
            var classDeclarationNode = classDeclarationWrapper.node;
            var classMeta = {
                kind: settings_1.IS_CLASS,
                namespace: _this.namespaceMapper.getNamespace(entryName, context.separator),
                name: classDeclarationNode.id.name,
                superClass: null,
                abstract: (_a = classDeclarationNode.abstract) !== null && _a !== void 0 ? _a : false,
                implements: [],
                constructor: [],
                methods: {},
                imports: (0, BabelAstHelper_1.retrieveImportsFromProgramNode)(programNode),
                export: {
                    path: context.filepath,
                    type: 'default'
                }
            };
            // rewrite local import path by their namespace
            if (((_b = classMeta.namespace) === null || _b === void 0 ? void 0 : _b.length) > 1) {
                classMeta.imports.forEach(function (_import, index) {
                    // Path is absolute (add it to path helper)
                    // if (resolve(_import.path) == path.normalize(_import.path)) {
                    //     // do some stuff
                    // } else {
                    _import.namespace = _this.namespaceMapper.getNamespacedEntryName((0, path_1.resolve)(context.filepath, '../', _import.namespace), context.rewriteRules, context.separator);
                });
            }
            if (classDeclarationNode.superClass !== null &&
                typeof classDeclarationNode.superClass !== 'undefined' &&
                'name' in classDeclarationNode.superClass) {
                classMeta.superClass = _this.localizer.resolveLocalImport(classDeclarationNode.superClass.name, classMeta.imports, entryName);
            }
            if (classDeclarationWrapper.parentNodeType === 'ExportDefaultDeclaration') {
                classMeta.export.type = 'export:default';
            }
            else if (classDeclarationWrapper.parentNodeType === 'ExportNamedDeclaration') {
                classMeta.export.type = 'export:named';
            }
            else {
                classMeta.export.type = 'inline';
            }
            (_c = classDeclarationNode === null || classDeclarationNode === void 0 ? void 0 : classDeclarationNode.implements) === null || _c === void 0 ? void 0 : _c.forEach(function (node) {
                if (node.type === 'TSExpressionWithTypeArguments') {
                    var expression = node.expression;
                    if ("name" in expression) {
                        classMeta.implements.push(_this.localizer.resolveLocalImport(expression.name, classMeta.imports, entryName));
                    }
                }
            });
            classDeclarationNode.body.body.filter(function (node) { return node.type === 'ClassMethod'; }).forEach(function (node) {
                if (node.kind === 'constructor') {
                    // const parameters = parser.retrieveSignature(node, classMeta.imports).parameters;
                    var parameters = node.params.map(function (param, index) {
                        return _this.parameterParser.parse(param, index, classMeta.imports);
                    });
                    classMeta.constructor = parameters;
                }
                else if (node.kind === 'method') {
                    var nodeName = '';
                    if ("name" in node.key) {
                        nodeName = node.key.name;
                    }
                    var methodMeta = {
                        visibility: ReflectionMethodVisibility_1.ReflectionMethodVisibility.PUBLIC,
                        abstract: false,
                        static: node.static,
                        computed: node.computed,
                        async: node.async,
                        name: nodeName,
                        parameters: node.params.map(function (param, index) {
                            return _this.parameterParser.parse(param, index, classMeta.imports);
                        }),
                        returnType: node.returnType
                            ? (0, BabelAstHelper_1.getInstanceTypeNameFromNode)(node.returnType)
                            : 'unknown'
                    };
                    classMeta.methods[methodMeta.name] = methodMeta;
                }
            });
            classMeta.name = _this.getFinalEntryName(entryName, hasMultipleDeclarationInProgram, classMeta);
            codeElementMetadata.push(classMeta);
        });
        var interfaceDeclarationNodes = (0, BabelAstHelper_1.getInterfaceDefinitionInProgram)(programNode);
        interfaceDeclarationNodes.forEach(function (interfaceDeclaration) {
            var _a, _b;
            var interfaceNode = interfaceDeclaration.node;
            var interfaceMeta = {
                kind: settings_1.IS_INTERFACE,
                namespace: _this.namespaceMapper.getNamespace(entryName, context.separator),
                name: interfaceNode.id.name,
                implements: [],
                methods: {},
                imports: (0, BabelAstHelper_1.retrieveImportsFromProgramNode)(programNode),
                export: {
                    path: context.filepath,
                    type: 'default'
                }
            };
            // rewrite local import path by their namespace
            if (((_a = interfaceMeta.namespace) === null || _a === void 0 ? void 0 : _a.length) > 1) {
                interfaceMeta.imports.forEach(function (_import, index) {
                    // Path is absolute (add it to path helper)
                    // if (resolve(_import.path) == path.normalize(_import.path)) {
                    //     // do some stuff
                    // } else {
                    _import.namespace = _this.namespaceMapper.getNamespacedEntryName((0, path_1.resolve)(context.filepath, '../', _import.namespace), context.rewriteRules, context.separator);
                });
            }
            if (interfaceDeclaration.parentNodeType === 'ExportDefaultDeclaration') {
                interfaceMeta.export.type = 'export:default';
            }
            else if (interfaceDeclaration.parentNodeType === 'ExportNamedDeclaration') {
                interfaceMeta.export.type = 'export:named';
            }
            else {
                interfaceMeta.export.type = 'inline';
            }
            (_b = interfaceNode === null || interfaceNode === void 0 ? void 0 : interfaceNode.extends) === null || _b === void 0 ? void 0 : _b.forEach(function (node) {
                if (node.type === 'TSExpressionWithTypeArguments') {
                    var expression = node.expression;
                    if ("name" in expression) {
                        interfaceMeta.implements.push(_this.localizer.resolveLocalImport(expression.name, interfaceMeta.imports, entryName));
                    }
                }
            });
            interfaceNode.body.body.filter(function (node) { return node.type === 'TSMethodSignature'; }).forEach(function (node) {
                var _a;
                if (node.kind === 'method') {
                    var nodeName = '';
                    if ("name" in node.key) {
                        nodeName = node.key.name;
                    }
                    var methodMeta = {
                        abstract: false,
                        visibility: ReflectionMethodVisibility_1.ReflectionMethodVisibility.PUBLIC,
                        static: false,
                        computed: (_a = node.computed) !== null && _a !== void 0 ? _a : false,
                        async: false,
                        name: nodeName,
                        parameters: node.parameters.map(function (param, index) {
                            return _this.parameterParser.parse(param, index);
                        }),
                        returnType: 'unknown until babel 8.0'
                    };
                    interfaceMeta.methods[methodMeta.name] = methodMeta;
                }
            });
            interfaceMeta.name = _this.getFinalEntryName(entryName, hasMultipleDeclarationInProgram, interfaceMeta);
            codeElementMetadata.push(interfaceMeta);
        });
        return codeElementMetadata;
    };
    BabelParserFileAnalyzer.prototype.getFinalEntryName = function (entryName, hasMultipleDeclarationInProgram, meta) {
        return entryName + ((hasMultipleDeclarationInProgram && meta.export.type !== 'export:default')
            ? "::".concat(meta.name.toLowerCase())
            : '');
    };
    return BabelParserFileAnalyzer;
}());
exports.default = BabelParserFileAnalyzer;
//# sourceMappingURL=BabelParserFileAnalyzer.js.map