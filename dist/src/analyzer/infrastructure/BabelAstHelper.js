"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retrieveImportsFromProgramNode = exports.getInterfaceDefinitionInProgram = exports.getClassDeclarationFromProgramNode = exports.getInstanceTypeNameFromNode = exports.isAssignmentPattern = void 0;
/**
 * Check if a babel AST node is an AssignementPattern node or not.
 * As babel 7 type inheritance and helper are not fully reliable, prefers manually check type
 */
var isAssignmentPattern = function (node) {
    return node.type === 'AssignmentPattern';
};
exports.isAssignmentPattern = isAssignmentPattern;
// use any instead of real type hint cause types exported by babel/types are a true brainfuck
var getInstanceTypeNameFromNode = function (givenNode) {
    var _a, _b;
    var node;
    if ((_a = givenNode === null || givenNode === void 0 ? void 0 : givenNode.typeAnnotation) === null || _a === void 0 ? void 0 : _a.typeAnnotation) {
        node = (_b = givenNode === null || givenNode === void 0 ? void 0 : givenNode.typeAnnotation) === null || _b === void 0 ? void 0 : _b.typeAnnotation;
    }
    else if (givenNode.type === 'TSTypeAnnotation') {
        node = givenNode.typeAnnotation;
    }
    else {
        node = givenNode;
    }
    if (node) {
        switch (node.type) {
            case 'TSNumberKeyword':
                return 'number';
            case 'TSStringKeyword':
                return 'string';
            case 'TSAnyKeyword':
                return 'any';
            case 'TSObjectKeyword':
                return 'object';
            case 'TSUnknownKeyword':
                return 'unknown';
            case 'TSBooleanKeyword':
            case 'BooleanLiteral':
                return 'boolean';
            case 'TSArrayType':
                return 'array';
            case 'TSUndefinedKeyword':
                return 'undefined';
            case 'Identifier':
                return 'unknown';
            case 'ObjectPattern':
                return 'object';
            case 'TSNullKeyword':
                return 'null';
            case 'TSVoidKeyword':
                return 'void';
            case 'TSUnionType':
                // @ts-ignore : babel types are fucked
                return node.types.map(function (unionNode) { return (0, exports.getInstanceTypeNameFromNode)(unionNode); }).join('|');
            case 'AssignmentPattern':
                return (0, exports.getInstanceTypeNameFromNode)(node.left);
            default:
                return node.typeName.name;
        }
    }
    return 'unknown';
};
exports.getInstanceTypeNameFromNode = getInstanceTypeNameFromNode;
var getClassDeclarationFromProgramNode = function (program) {
    var _a;
    var declarations = [];
    program.body.filter(function (node) { return node.type === 'ClassDeclaration'; }).forEach(function (node) {
        declarations.push({
            node: node,
            parentNodeType: 'Program'
        });
    });
    program.body.filter(function (child) { return child.type === 'ExportNamedDeclaration'; }).forEach(function (entry) {
        if (entry.declaration.type === 'ClassDeclaration') {
            declarations.push({
                node: entry.declaration,
                parentNodeType: 'ExportNamedDeclaration'
            });
        }
    });
    var exportDefaultDeclarationNode = program.body.find(function (node) { return node.type === 'ExportDefaultDeclaration'; });
    if (((_a = exportDefaultDeclarationNode === null || exportDefaultDeclarationNode === void 0 ? void 0 : exportDefaultDeclarationNode.declaration) === null || _a === void 0 ? void 0 : _a.type) === 'ClassDeclaration') {
        declarations.push({
            node: exportDefaultDeclarationNode.declaration,
            parentNodeType: 'ExportDefaultDeclaration'
        });
    }
    return declarations;
};
exports.getClassDeclarationFromProgramNode = getClassDeclarationFromProgramNode;
var getInterfaceDefinitionInProgram = function (program) {
    var _a;
    var declarations = [];
    program.body.filter(function (node) { return node.type === 'TSInterfaceDeclaration'; }).forEach(function (node) {
        declarations.push({
            node: node,
            parentNodeType: 'Program'
        });
    });
    program.body.filter(function (child) { return child.type === 'ExportNamedDeclaration'; }).forEach(function (entry) {
        // @ts-ignore
        if (entry.declaration.type === 'TSInterfaceDeclaration') {
            declarations.push({
                node: entry.declaration,
                parentNodeType: 'ExportNamedDeclaration'
            });
        }
    });
    var exportDefaultDeclarationNode = program.body.find(function (node) { return node.type === 'ExportDefaultDeclaration'; });
    // @ts-ignore
    if (((_a = exportDefaultDeclarationNode === null || exportDefaultDeclarationNode === void 0 ? void 0 : exportDefaultDeclarationNode.declaration) === null || _a === void 0 ? void 0 : _a.type) === 'TSInterfaceDeclaration') {
        declarations.push({
            node: exportDefaultDeclarationNode.declaration,
            parentNodeType: 'ExportDefaultDeclaration'
        });
    }
    return declarations;
};
exports.getInterfaceDefinitionInProgram = getInterfaceDefinitionInProgram;
var retrieveImportsFromProgramNode = function (program) {
    var imports = [];
    program.body.filter(function (node) { return node.type === 'ImportDeclaration'; }).forEach(function (importDeclarationNode) {
        importDeclarationNode.specifiers.forEach(function (specifier) {
            var _a;
            imports.push({
                name: (_a = specifier.local) === null || _a === void 0 ? void 0 : _a.name,
                namespace: importDeclarationNode.source.value
            });
        });
    });
    return imports;
};
exports.retrieveImportsFromProgramNode = retrieveImportsFromProgramNode;
//# sourceMappingURL=BabelAstHelper.js.map