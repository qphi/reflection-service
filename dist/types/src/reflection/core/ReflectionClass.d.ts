import ReflectionClassInterface from "../api/ReflectionClassInterface";
import ReflectionMethodInterface from "../api/ReflectionMethodInterface";
export default class ReflectionClass implements ReflectionClassInterface {
    private methods;
    private implementedInterfacesName;
    private extendedClassesName;
    private _isAbstract;
    private name;
    private classProvider;
    setName(name: string): this;
    getClass(): any;
    setClassProvider(provider: () => any): () => any;
    getName(): string;
    setAbstract(value: boolean): this;
    addMethod(method: ReflectionMethodInterface): this;
    setMethods(methods: ReflectionMethodInterface[]): this;
    isImplementationOf(interfaceName: string): this;
    isExtensionOf(className: string): this;
    implements(interfaceName: string): boolean;
    extends(className: string): boolean;
    getMethod(methodName: string): ReflectionMethodInterface;
    getMethods(): ReflectionMethodInterface[];
    isAbstract(): boolean;
}
//# sourceMappingURL=ReflectionClass.d.ts.map