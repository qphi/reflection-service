import * as babelParser from "@babel/parser";
import {ObjectLocation} from "../api/types";
import InvalidAssignmentNodeException from "./exception/InvalidAssignmentNodeException";
import {getInstanceTypeNameFromNode} from "./BabelAstHelper";

export default class FunctionDeclarationResolver {
    private parser;

    constructor() {
        this.parser = babelParser;
    }

    public generateNode(code: string) {
        return this.parser.parseExpression(code, {
            sourceType: 'script',
            plugins: [
                'typescript'
            ]
        });
    }


    public filterNodes(ast) {
        return ast.program.body.filter(node => node.type === 'FunctionDeclaration');
    }


    public retrieveValueFromObjectExpression(objectExpressionNode) {
        const value: any = {};

        objectExpressionNode.properties.forEach(node => {
            if (node.type === 'ObjectProperty') {
                value[node.key.name] = node.value.value;
            }
        });

        return value;
    }

    public retrieveDefaultValueFromNode(assignmentNode) {
        if (assignmentNode.type !== 'AssignmentPattern') {
            throw new InvalidAssignmentNodeException(
                `An AssignmentPattern is expected but "${assignmentNode.type}" is given`
            );
        }

        if (assignmentNode.right.type === 'ObjectExpression') {
            return this.retrieveValueFromObjectExpression(assignmentNode.right);
        } else {
            return assignmentNode.right.value;
        }

    }

    public retrieveSignature(functionNode, importsContext: ObjectLocation[] = []) {
        const name = functionNode.id?.name;
        const parameters: Array<any> = [];
        const returnType = undefined;

        functionNode.params.forEach(parameterNode => {
            let type: string = 'unknown';
            let parameterName: string = 'unknown';
            let defaultValue: any = undefined;

            if (parameterNode.type === 'AssignmentPattern') {
                // (left) a = 8 (right)
                parameterName = parameterNode.left.name;
                defaultValue = this.retrieveDefaultValueFromNode(parameterNode);
                type = getInstanceTypeNameFromNode(parameterNode.left);

            } else {
                parameterName = parameterNode.name;
                type = getInstanceTypeNameFromNode(parameterNode);
            }

            let namespace = importsContext.find(_import => _import.name === type)?.namespace ?? undefined;
            parameters.push({
                name: parameterName,
                type,
                defaultValue,
                namespace
            });
        });

        return {
            async: functionNode.async,
            returnType,
            name,
            parameters
        };
    }

    public resolveFromString(functionCode: string) {
        try {
            const functionNode = this.generateNode(functionCode);
            return this.retrieveSignature(functionNode);
        } catch (err) {
            console.error(err);
        }
    }
}
