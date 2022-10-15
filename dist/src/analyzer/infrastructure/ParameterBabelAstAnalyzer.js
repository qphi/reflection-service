"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BabelAstHelper_1 = require("./BabelAstHelper");
var ParameterBabelAstAnalyzer = /** @class */ (function () {
    function ParameterBabelAstAnalyzer() {
    }
    ParameterBabelAstAnalyzer.prototype.parse = function (
    // @ts-ignore : babel shitty types
    node, index, importsContext) {
        var _a, _b, _c;
        if (importsContext === void 0) { importsContext = []; }
        var data = {
            name: '',
            namespace: undefined,
            position: index,
            type: 'unkown',
            optional: false,
            defaultValue: undefined
        };
        var _isAssignmentPattern = (0, BabelAstHelper_1.isAssignmentPattern)(node);
        if (node.type === 'Identifier') {
            data.optional = (_a = node.optional) !== null && _a !== void 0 ? _a : false;
        }
        if (_isAssignmentPattern
            && 'left' in node
            && 'name' in node.left) {
            data.name = node.left.name;
        }
        else {
            if ('name' in node) {
                data.name = node.name;
            }
            else {
                data.name = 'undefined';
            }
        }
        data.type = (0, BabelAstHelper_1.getInstanceTypeNameFromNode)(node);
        if (_isAssignmentPattern) {
            data.defaultValue = (0, BabelAstHelper_1.getInstanceTypeNameFromNode)(node);
            data.optional = true;
        }
        data.namespace = (_c = (_b = importsContext.find(function (_import) { return _import.name === data.type; })) === null || _b === void 0 ? void 0 : _b.namespace) !== null && _c !== void 0 ? _c : undefined;
        return data;
    };
    return ParameterBabelAstAnalyzer;
}());
exports.default = ParameterBabelAstAnalyzer;
//# sourceMappingURL=ParameterBabelAstAnalyzer.js.map