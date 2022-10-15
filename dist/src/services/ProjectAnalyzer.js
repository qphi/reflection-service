"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var CodeAnalyzerService_1 = require("../analyzer/core/CodeAnalyzerService");
var DreeFileScanner_1 = require("../analyzer/infrastructure/DreeFileScanner");
var BabelParserFileAnalyzer_1 = require("../analyzer/infrastructure/BabelParserFileAnalyzer");
var NamespaceMapperService_1 = require("../analyzer/core/NamespaceMapperService");
var ObjectLocalizerService_1 = require("../analyzer/core/ObjectLocalizerService");
var ProjectAnalyzer = /** @class */ (function (_super) {
    __extends(ProjectAnalyzer, _super);
    function ProjectAnalyzer() {
        return _super.call(this, new DreeFileScanner_1.default(), new BabelParserFileAnalyzer_1.default(new NamespaceMapperService_1.default(), new ObjectLocalizerService_1.default())) || this;
    }
    return ProjectAnalyzer;
}(CodeAnalyzerService_1.default));
exports.default = ProjectAnalyzer;
//# sourceMappingURL=ProjectAnalyzer.js.map