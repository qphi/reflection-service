import VoidInterface from "./VoidInterface";

export default class Sapristi implements VoidInterface {
    constructor(id) {
    }

    public initializeHandler() {
    }

    public addHandler(handler, name: string) {
    }

    public removeHandler(name: string) {
    }

    public load(path: string, container) {
    }

    public parseResources(parameters, path, container) {
    }

    /**
     * @throws InvalidArgumentException
     */
    public parseDefaults(parameters, path: string) {
    }

    public parseDefinition(id: string, resource: object | string | null, path: string, defaults, shouldReturn = false) {
    }

    public resolveInstanceOf(_instanceof, path, container) {
    }

    public parseParameters(parameters, path, container) {
    }

    public resolveValue(value) {
    }

    public parseImport(content, path: string, container) {
    }

    public match(key: string): boolean {
        return true
    }

    public process(): void {
        // this is intentional
    }
}
