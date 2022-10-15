"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildInheritanceTreeFromClassMetadataCollection = exports.GET_EMPTY_INHERITANCE_TREE = void 0;
var settings_1 = require("../api/settings");
var GET_EMPTY_INHERITANCE_TREE = function () {
    return {
        extendsClass: {},
        implementsInterface: {}
    };
};
exports.GET_EMPTY_INHERITANCE_TREE = GET_EMPTY_INHERITANCE_TREE;
var buildInheritanceTreeFromClassMetadataCollection = function (codeElementMetadata) {
    var classes = Object.keys(codeElementMetadata);
    var inheritanceTree = {
        extendsClass: {},
        implementsInterface: {}
    };
    // add class node to tree
    classes.forEach(function (_class) {
        inheritanceTree.implementsInterface[_class] = codeElementMetadata[_class].implements.map(function (interfaceLocation) { return interfaceLocation.namespace; });
        if (codeElementMetadata[_class].kind === settings_1.IS_INTERFACE) {
            // no extends for interfaces
            inheritanceTree.extendsClass[_class] = [];
            return;
        }
        var meta = codeElementMetadata[_class];
        inheritanceTree.extendsClass[_class] = meta.superClass ? [meta.superClass.namespace] : [];
    });
    // build interface inheritance tree
    classes.forEach(function (_class) {
        var _a, _b;
        var ancestors = inheritanceTree.extendsClass[_class];
        if (ancestors.length > 0) {
            var oldestAncestor = ancestors[ancestors.length - 1];
            ancestors = inheritanceTree.extendsClass[oldestAncestor];
            while (ancestors.length > 0) {
                inheritanceTree.extendsClass[_class] = inheritanceTree.extendsClass[_class].concat(ancestors);
                oldestAncestor = ancestors[ancestors.length - 1];
                ancestors = inheritanceTree.extendsClass[oldestAncestor];
            }
        }
        var interfacesToCheck = (_a = inheritanceTree.implementsInterface[_class]) !== null && _a !== void 0 ? _a : [];
        var interfacesSeen = {};
        // resolve interface inheritance
        while (Array.isArray(interfacesToCheck) && interfacesToCheck.length > 0) {
            var newInterfaceToCheck = [];
            for (var _i = 0, interfacesToCheck_1 = interfacesToCheck; _i < interfacesToCheck_1.length; _i++) {
                var interfaceName = interfacesToCheck_1[_i];
                if (interfacesSeen[interfaceName]) {
                    continue;
                }
                interfacesSeen[interfaceName] = true;
                var candidates = (_b = inheritanceTree.implementsInterface[interfaceName]) !== null && _b !== void 0 ? _b : [];
                if (candidates.length > 0) {
                    newInterfaceToCheck = newInterfaceToCheck.concat(candidates);
                }
            }
            inheritanceTree.implementsInterface[_class] = inheritanceTree.implementsInterface[_class].concat(newInterfaceToCheck);
            interfacesToCheck = newInterfaceToCheck;
        }
    });
    // resolve all interface implementation from super class to sub-classes
    classes.forEach(function (_class) {
        var interfacesSeen = {};
        inheritanceTree.implementsInterface[_class].forEach(function (_interface) {
            interfacesSeen[_interface] = true;
        });
        var candidates = inheritanceTree.extendsClass[_class].map(function (superClass) { return inheritanceTree.implementsInterface[superClass]; }).flat();
        for (var _i = 0, candidates_1 = candidates; _i < candidates_1.length; _i++) {
            var candidate = candidates_1[_i];
            if (!interfacesSeen[candidate]) {
                interfacesSeen[candidate] = true;
                inheritanceTree.implementsInterface[_class].push(candidate);
            }
        }
    });
    return inheritanceTree;
};
exports.buildInheritanceTreeFromClassMetadataCollection = buildInheritanceTreeFromClassMetadataCollection;
//# sourceMappingURL=InheritanceTreeService.js.map