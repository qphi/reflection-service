"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectAnalyzer = exports.ReflectionParameter = exports.ReflectionMethod = exports.ReflectionInterface = exports.ReflectionService = exports.ReflectionClass = exports.ReflectionMethodVisibility = exports.ObjectLocalizerService = exports.NamespaceMapperService = exports.CodeAnalyzerService = exports.AnalyserAPISettings = void 0;
exports.AnalyserAPISettings = require("./src/analyzer/api/settings");
__exportStar(require("./src/analyzer/api/types"), exports);
var CodeAnalyzerService_1 = require("./src/analyzer/core/CodeAnalyzerService");
Object.defineProperty(exports, "CodeAnalyzerService", { enumerable: true, get: function () { return CodeAnalyzerService_1.default; } });
var NamespaceMapperService_1 = require("./src/analyzer/core/NamespaceMapperService");
Object.defineProperty(exports, "NamespaceMapperService", { enumerable: true, get: function () { return NamespaceMapperService_1.default; } });
var ObjectLocalizerService_1 = require("./src/analyzer/core/ObjectLocalizerService");
Object.defineProperty(exports, "ObjectLocalizerService", { enumerable: true, get: function () { return ObjectLocalizerService_1.default; } });
exports.ReflectionMethodVisibility = require("./src/reflection/api/ReflectionMethodVisibility");
var ReflectionClass_1 = require("./src/reflection/core/ReflectionClass");
Object.defineProperty(exports, "ReflectionClass", { enumerable: true, get: function () { return ReflectionClass_1.default; } });
var ReflectionService_1 = require("./src/reflection/core/ReflectionService");
Object.defineProperty(exports, "ReflectionService", { enumerable: true, get: function () { return ReflectionService_1.default; } });
var ReflectionInterface_1 = require("./src/reflection/core/ReflectionInterface");
Object.defineProperty(exports, "ReflectionInterface", { enumerable: true, get: function () { return ReflectionInterface_1.default; } });
var ReflectionMethod_1 = require("./src/reflection/core/ReflectionMethod");
Object.defineProperty(exports, "ReflectionMethod", { enumerable: true, get: function () { return ReflectionMethod_1.default; } });
var ReflectionParameter_1 = require("./src/reflection/core/ReflectionParameter");
Object.defineProperty(exports, "ReflectionParameter", { enumerable: true, get: function () { return ReflectionParameter_1.default; } });
var index_1 = require("./src/index");
Object.defineProperty(exports, "ProjectAnalyzer", { enumerable: true, get: function () { return index_1.ProjectAnalyzer; } });
//# sourceMappingURL=index.js.map