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
var dree_1 = require("dree");
var publisher_subscriber_1 = require("@qphi/publisher-subscriber");
var FileScannerService = /** @class */ (function (_super) {
    __extends(FileScannerService, _super);
    function FileScannerService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FileScannerService.prototype.scan = function (rootpath, exclude, extensions) {
        var _this = this;
        (0, dree_1.scan)(rootpath, {
            exclude: exclude,
            hash: false,
            depth: 10,
            size: false,
            extensions: extensions
        }, function (file) {
            _this.onFileFound(file);
        });
    };
    FileScannerService.prototype.setOnFileFoundHandler = function (callback) {
        this.onFileFound = callback;
        return this;
    };
    return FileScannerService;
}(publisher_subscriber_1.Publisher));
exports.default = FileScannerService;
//# sourceMappingURL=FileScannerService.js.map