import ReflectionClassInterface from "../api/ReflectionClassInterface";
import ReflectionMethodInterface from "../api/ReflectionMethodInterface";
export default class ReflectionClass implements ReflectionClassInterface {
    private methods;
    private implementedInterfacesName;
    private extendedClassesName;
    private _isAbstract;
    private filePath;
    private name;
    private classProvider;
    setName(name: string): this;
    getClass(): any;
    setClassProvider(provider: () => any): this;
    getName(): string;
    setAbstract(value: boolean): this;
    addMethod(method: ReflectionMethodInterface): this;
    setMethods(methods: ReflectionMethodInterface[]): this;
    isImplementationOf(interfaceName: string): this;
    isExtensionOf(className: string): this;
    implements(interfaceName: string): boolean;
    extends(className: string): boolean;
    getMethod(methodName: string): ReflectionMethodInterface;
    hasMethod(methodName: string): boolean;
    getMethods(): ReflectionMethodInterface[];
    isAbstract(): boolean;
    getFilePath(): string;
    setFilePath(filePath: string): this;
}
//# sourceMappingURL=ReflectionClass.d.ts.map