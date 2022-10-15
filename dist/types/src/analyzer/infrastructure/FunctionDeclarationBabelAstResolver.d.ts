import { ObjectLocation } from "../api/types";
export default class FunctionDeclarationResolver {
    private parser;
    constructor();
    generateNode(code: string): any;
    filterNodes(ast: any): any;
    retrieveValueFromObjectExpression(objectExpressionNode: any): any;
    retrieveDefaultValueFromNode(assignmentNode: any): any;
    retrieveSignature(functionNode: any, importsContext?: ObjectLocation[]): {
        async: any;
        returnType: any;
        name: any;
        parameters: any[];
    };
    resolveFromString(functionCode: string): {
        async: any;
        returnType: any;
        name: any;
        parameters: any[];
    };
}
//# sourceMappingURL=FunctionDeclarationBabelAstResolver.d.ts.map