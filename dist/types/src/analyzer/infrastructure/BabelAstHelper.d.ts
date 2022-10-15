import type { Node, Program } from '@babel/types';
import { ClassDeclarationWrapper, InterfaceDeclarationWrapper } from "../infrastructure/types";
import { ObjectLocation } from "../api/types";
/**
 * Check if a babel AST node is an AssignementPattern node or not.
 * As babel 7 type inheritance and helper are not fully reliable, prefers manually check type
 */
export declare const isAssignmentPattern: (node: Node) => boolean;
export declare const getInstanceTypeNameFromNode: (givenNode: any) => string;
export declare const getClassDeclarationFromProgramNode: (program: Program) => ClassDeclarationWrapper[];
export declare const getInterfaceDefinitionInProgram: (program: Program) => InterfaceDeclarationWrapper[];
export declare const retrieveImportsFromProgramNode: (program: Program) => ObjectLocation[];
//# sourceMappingURL=BabelAstHelper.d.ts.map