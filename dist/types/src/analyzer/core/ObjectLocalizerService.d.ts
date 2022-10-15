import { ObjectLocation } from "../api/types";
import ObjectLocalizerInterface from "../api/ObjectLocalizerInterface";
export default class ObjectLocalizerService implements ObjectLocalizerInterface {
    resolveLocalImport(entry: string, _imports: ObjectLocation[], currentNamespace: string): ObjectLocation;
}
//# sourceMappingURL=ObjectLocalizerService.d.ts.map