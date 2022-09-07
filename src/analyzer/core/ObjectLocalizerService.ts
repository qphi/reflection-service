import {ObjectLocation} from "../api/types";
import ObjectLocalizerInterface from "../api/ObjectLocalizerInterface";

export default class ObjectLocalizerService implements ObjectLocalizerInterface{
    resolveLocalImport(
        entry: string,
        _imports: ObjectLocation[],
        currentNamespace: string
    ): ObjectLocation {
        const importedObjectLocation = _imports.find(location => location.name === entry);
        const location = {
            name: entry,
            namespace: ''
        };

        if (importedObjectLocation) {
            location.namespace = importedObjectLocation.namespace;
        } else {
            location.namespace = `${currentNamespace}::${entry}`;
        }

        return location;
    }
}
