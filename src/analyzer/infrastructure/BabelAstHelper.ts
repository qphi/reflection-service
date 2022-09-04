import {Node} from "@babel/types";

/**
 * Check if a babel AST node is an AssignementPattern node or not.
 * As babel 7 type inheritance and helper are not fully reliable, prefers manually check type
 */
export const isAssignmentPattern = (node: Node): boolean => {
    return node.type === 'AssignmentPattern';
}

export const getInstanceTypeNameFromNode = (givenNode: Node & Partial<{ typeAnnotation: { typeAnnotation: string } }>): string => {
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
