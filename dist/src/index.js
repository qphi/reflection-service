"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectAnalyzer = void 0;
var CodeAnalyzerService_1 = require("./analyzer/core/CodeAnalyzerService");
var DreeFileScanner_1 = require("./analyzer/infrastructure/DreeFileScanner");
var BabelParserFileAnalyzer_1 = require("./analyzer/infrastructure/BabelParserFileAnalyzer");
var NamespaceMapperService_1 = require("./analyzer/core/NamespaceMapperService");
var ObjectLocalizerService_1 = require("./analyzer/core/ObjectLocalizerService");
exports.ProjectAnalyzer = new CodeAnalyzerService_1.default(new DreeFileScanner_1.default(), new BabelParserFileAnalyzer_1.default(new NamespaceMapperService_1.default(), new ObjectLocalizerService_1.default()));
//# sourceMappingURL=index.js.map