import type {
    ClassDeclaration,
    ExportDefaultDeclaration,
    Identifier,
    ImportDeclaration,
    Node,
    Program, TSInterfaceDeclaration
} from '@babel/types';
import {ClassDeclarationWrapper, InterfaceDeclarationWrapper} from "../infrastructure/types";
import {ObjectLocation} from "../api/types";

/**
 * Check if a babel AST node is an AssignementPattern node or not.
 * As babel 7 type inheritance and helper are not fully reliable, prefers manually check type
 */
export const isAssignmentPattern = (node: Node): boolean => {
    return node.type === 'AssignmentPattern';
}

// use any instead of real type hint cause types exported by babel/types are a true brainfuck
export const getInstanceTypeNameFromNode = (givenNode: any): string => {
    let node;
    if (givenNode?.typeAnnotation?.typeAnnotation) {
        node = givenNode?.typeAnnotation?.typeAnnotation;
    } else if (givenNode.type === 'TSTypeAnnotation') {
        node = givenNode.typeAnnotation;
    } else {
        node = givenNode
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
                return node.types.map(unionNode => getInstanceTypeNameFromNode(unionNode)).join('|');
            case 'AssignmentPattern':
                return getInstanceTypeNameFromNode(node.left);
            default:
                return node.typeName.name
        }
    }

    return 'unknown';
}


export const getClassDeclarationFromProgramNode = (program: Program): ClassDeclarationWrapper[] => {
    const declarations: ClassDeclarationWrapper[] = [];
    program.body.filter(node => node.type === 'ClassDeclaration').forEach(node => {
        declarations.push({
            node: node as ClassDeclaration,
            parentNodeType: 'Program'
        });
    });


    program.body.filter(child => child.type === 'ExportNamedDeclaration').forEach((entry: ExportDefaultDeclaration) => {
        if (entry.declaration.type === 'ClassDeclaration') {
            declarations.push({
                node: entry.declaration as unknown as ClassDeclaration,
                parentNodeType: 'ExportNamedDeclaration'
            });
        }
    });


    const exportDefaultDeclarationNode = program.body.find(
        node => node.type === 'ExportDefaultDeclaration'
    ) as ExportDefaultDeclaration;

    if (exportDefaultDeclarationNode?.declaration?.type === 'ClassDeclaration') {
        declarations.push({
            node: exportDefaultDeclarationNode.declaration as unknown as ClassDeclaration,
            parentNodeType: 'ExportDefaultDeclaration'
        });
    }

    return declarations;
}

export const getInterfaceDefinitionInProgram = (program: Program): InterfaceDeclarationWrapper[] => {
    const declarations: InterfaceDeclarationWrapper[] = [];
    program.body.filter(node => node.type === 'TSInterfaceDeclaration').forEach(node => {
        declarations.push({
            node: node as TSInterfaceDeclaration,
            parentNodeType: 'Program'
        });
    });

    program.body.filter(child => child.type === 'ExportNamedDeclaration').forEach((entry: ExportDefaultDeclaration) => {
        // @ts-ignore
        if (entry.declaration.type === 'TSInterfaceDeclaration') {
            declarations.push({
                node: entry.declaration as unknown as TSInterfaceDeclaration,
                parentNodeType: 'ExportNamedDeclaration'
            });
        }
    });

    const exportDefaultDeclarationNode = program.body.find(
        node => node.type === 'ExportDefaultDeclaration'
    ) as ExportDefaultDeclaration;

    // @ts-ignore
    if (exportDefaultDeclarationNode?.declaration?.type === 'TSInterfaceDeclaration') {
        declarations.push({
            node: exportDefaultDeclarationNode.declaration as unknown as TSInterfaceDeclaration,
            parentNodeType: 'ExportDefaultDeclaration'
        });
    }

    return declarations;
}

export const retrieveImportsFromProgramNode = (program: Program): ObjectLocation[] => {
    const imports: ObjectLocation[] = [];
    (program.body.filter(node => node.type === 'ImportDeclaration') as ImportDeclaration[]).forEach(
        (importDeclarationNode: ImportDeclaration) => {
            importDeclarationNode.specifiers.forEach(specifier => {
                imports.push({
                    name: specifier.local?.name,
                    namespace: importDeclarationNode.source.value
                });
            });
        }
    );

    return imports;
}
