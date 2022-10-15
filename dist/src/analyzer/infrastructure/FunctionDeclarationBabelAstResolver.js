"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var babelParser = require("@babel/parser");
var InvalidAssignmentNodeException_1 = require("./exception/InvalidAssignmentNodeException");
var BabelAstHelper_1 = require("./BabelAstHelper");
var FunctionDeclarationResolver = /** @class */ (function () {
    function FunctionDeclarationResolver() {
        this.parser = babelParser;
    }
    FunctionDeclarationResolver.prototype.generateNode = function (code) {
        return this.parser.parseExpression(code, {
            sourceType: 'script',
            plugins: [
                'typescript'
            ]
        });
    };
    FunctionDeclarationResolver.prototype.filterNodes = function (ast) {
        return ast.program.body.filter(function (node) { return node.type === 'FunctionDeclaration'; });
    };
    FunctionDeclarationResolver.prototype.retrieveValueFromObjectExpression = function (objectExpressionNode) {
        var value = {};
        objectExpressionNode.properties.forEach(function (node) {
            if (node.type === 'ObjectProperty') {
                value[node.key.name] = node.value.value;
            }
        });
        return value;
    };
    FunctionDeclarationResolver.prototype.retrieveDefaultValueFromNode = function (assignmentNode) {
        if (assignmentNode.type !== 'AssignmentPattern') {
            throw new InvalidAssignmentNodeException_1.default("An AssignmentPattern is expected but \"".concat(assignmentNode.type, "\" is given"));
        }
        if (assignmentNode.right.type === 'ObjectExpression') {
            return this.retrieveValueFromObjectExpression(assignmentNode.right);
        }
        else {
            return assignmentNode.right.value;
        }
    };
    FunctionDeclarationResolver.prototype.retrieveSignature = function (functionNode, importsContext) {
        var _this = this;
        var _a;
        if (importsContext === void 0) { importsContext = []; }
        var name = (_a = functionNode.id) === null || _a === void 0 ? void 0 : _a.name;
        var parameters = [];
        var returnType = undefined;
        functionNode.params.forEach(function (parameterNode) {
            var _a, _b;
            var type = 'unknown';
            var parameterName = 'unknown';
            var defaultValue = undefined;
            if (parameterNode.type === 'AssignmentPattern') {
                // (left) a = 8 (right)
                parameterName = parameterNode.left.name;
                defaultValue = _this.retrieveDefaultValueFromNode(parameterNode);
                type = (0, BabelAstHelper_1.getInstanceTypeNameFromNode)(parameterNode.left);
            }
            else {
                parameterName = parameterNode.name;
                type = (0, BabelAstHelper_1.getInstanceTypeNameFromNode)(parameterNode);
            }
            var namespace = (_b = (_a = importsContext.find(function (_import) { return _import.name === type; })) === null || _a === void 0 ? void 0 : _a.namespace) !== null && _b !== void 0 ? _b : undefined;
            parameters.push({
                name: parameterName,
                type: type,
                defaultValue: defaultValue,
                namespace: namespace
            });
        });
        return {
            async: functionNode.async,
            returnType: returnType,
            name: name,
            parameters: parameters
        };
    };
    FunctionDeclarationResolver.prototype.resolveFromString = function (functionCode) {
        try {
            var functionNode = this.generateNode(functionCode);
            return this.retrieveSignature(functionNode);
        }
        catch (err) {
            console.error(err);
        }
    };
    return FunctionDeclarationResolver;
}());
exports.default = FunctionDeclarationResolver;
//# sourceMappingURL=FunctionDeclarationBabelAstResolver.js.map