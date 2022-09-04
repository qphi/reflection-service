import {ObjectLocation, ParameterMetadata} from "../api/types";
import {getInstanceTypeNameFromNode, isAssignmentPattern} from "./BabelAstHelper";

export default class ParameterBabelAstAnalyzer {
    public parse(
        node,
        parser,
        index: number,
        importsContext: ObjectLocation[] = []
    ): ParameterMetadata {
        const data: ParameterMetadata = {
            name: '',
            namespace: undefined,
            position: index,
            type: 'unkown',
            optional: false,
            defaultValue: undefined
        };

        const _isAssignmentPattern = isAssignmentPattern(node);

        if (node.type === 'Identifier') {
            data.optional = node.optional ?? false;
        }

        if (
            _isAssignmentPattern
            && 'left' in node
            && 'name' in node.left
        ) {
            data.name = node.left.name;
        } else {
            if ('name' in node) {
                data.name = node.name;
            } else {
                data.name = 'undefined';
            }
        }

        data.type = getInstanceTypeNameFromNode(node);

        if (_isAssignmentPattern) {
            data.defaultValue = getInstanceTypeNameFromNode(node);
            data.optional = true;
        }

        data.namespace = importsContext.find(_import => _import.name === data.type)?.namespace ?? undefined;

        return data;
    }

}
