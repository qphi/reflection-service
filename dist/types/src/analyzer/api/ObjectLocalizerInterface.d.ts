import { ObjectLocation } from "../api/types";
export default interface ObjectLocalizerInterface {
    resolveLocalImport(entry: string, _imports: ObjectLocation[], currentNamespace: string): ObjectLocation;
}
//# sourceMappingURL=ObjectLocalizerInterface.d.ts.map