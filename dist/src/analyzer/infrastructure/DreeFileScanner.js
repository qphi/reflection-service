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
var FileScannerInterface_1 = require("../spi/FileScannerInterface");
var dree_1 = require("dree");
var publisher_subscriber_1 = require("@qphi/publisher-subscriber");
var fs_1 = require("fs");
var crypto_1 = require("crypto");
var DreeFileScanner = /** @class */ (function (_super) {
    __extends(DreeFileScanner, _super);
    function DreeFileScanner() {
        return _super.call(this, 'dree-file-scanner-' + (0, crypto_1.randomBytes)(4)) || this;
    }
    DreeFileScanner.prototype.scan = function (rootpath, exclude, extensions) {
        var _this = this;
        (0, dree_1.scan)(rootpath, {
            exclude: exclude,
            hash: false,
            depth: 10,
            extensions: extensions
        }, function (file) {
            var content = (0, fs_1.readFileSync)(file.path, 'utf-8');
            _this.publish(FileScannerInterface_1.FILE_CONTENT_AVAILABLE, {
                filePath: file.path,
                content: content
            });
        });
    };
    return DreeFileScanner;
}(publisher_subscriber_1.Publisher));
exports.default = DreeFileScanner;
//# sourceMappingURL=DreeFileScanner.js.map