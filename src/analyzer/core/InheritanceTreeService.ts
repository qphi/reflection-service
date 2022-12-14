import {ClassMetadata, CodeElementMetadata, InheritanceTree} from "../api/types";
import {IS_INTERFACE} from "../api/settings";

export const GET_EMPTY_INHERITANCE_TREE = ():InheritanceTree => {
    return {
        extendsClass: {},
        implementsInterface: {}
    } as InheritanceTree;
}

export const buildInheritanceTreeFromClassMetadataCollection = (
    codeElementMetadata: Record<string, CodeElementMetadata>
): InheritanceTree => {
    const classes = Object.keys(codeElementMetadata);
    const inheritanceTree: InheritanceTree = {
        extendsClass: {},
        implementsInterface: {}
    };

    // add class node to tree
    classes.forEach(_class => {
        inheritanceTree.implementsInterface[_class] = codeElementMetadata[_class].implements.map(
            interfaceLocation => interfaceLocation.namespace
        );

        if (codeElementMetadata[_class].kind === IS_INTERFACE) {
            // no extends for interfaces
            inheritanceTree.extendsClass[_class] = [];
            return;
        }

        const meta = codeElementMetadata[_class] as ClassMetadata;


        inheritanceTree.extendsClass[_class] = meta.superClass ? [meta.superClass.namespace] : [];
    });

    // build interface inheritance tree
    classes.forEach(_class => {
        let ancestors = inheritanceTree.extendsClass[_class];
        if (ancestors.length > 0) {
            let oldestAncestor = ancestors[ancestors.length - 1];
            ancestors = inheritanceTree.extendsClass[oldestAncestor];

            while (ancestors.length > 0) {
                inheritanceTree.extendsClass[_class] = inheritanceTree.extendsClass[_class].concat(ancestors);
                oldestAncestor = ancestors[ancestors.length - 1];
                ancestors = inheritanceTree.extendsClass[oldestAncestor];
            }
        }

        let interfacesToCheck: string[] = inheritanceTree.implementsInterface[_class] ?? [];
        const interfacesSeen: Record<string, boolean> = {};


        // resolve interface inheritance
        while (Array.isArray(interfacesToCheck) && interfacesToCheck.length > 0) {
            let newInterfaceToCheck: string[] = [];
            for (const interfaceName of interfacesToCheck) {
                if (interfacesSeen[interfaceName]) {
                    continue;
                }

                interfacesSeen[interfaceName] = true;
                const candidates = inheritanceTree.implementsInterface[interfaceName] ?? [];

                if (candidates.length > 0) {
                    newInterfaceToCheck = newInterfaceToCheck.concat(candidates);
                }
            }

            inheritanceTree.implementsInterface[_class] = inheritanceTree.implementsInterface[_class].concat(newInterfaceToCheck);
            interfacesToCheck = newInterfaceToCheck;
        }
    });

    // resolve all interface implementation from super class to sub-classes
    classes.forEach(_class => {
        const interfacesSeen: Record<string, boolean> = {};
        inheritanceTree.implementsInterface[_class].forEach(_interface => {
            interfacesSeen[_interface] = true;
        })

        const candidates = inheritanceTree.extendsClass[_class].map(superClass => inheritanceTree.implementsInterface[superClass]).flat();

        for (const candidate of candidates) {
            if (!interfacesSeen[candidate]) {
                interfacesSeen[candidate] = true;
                inheritanceTree.implementsInterface[_class].push(candidate);
            }
        }
    });

    return inheritanceTree;
}
