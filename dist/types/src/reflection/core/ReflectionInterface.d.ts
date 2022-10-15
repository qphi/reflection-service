import ReflectionMethodInterface from "../api/ReflectionMethodInterface";
import ReflectionInterfaceInterface from "../api/ReflectionInterfaceInterface";
export default class ReflectionInterface implements ReflectionInterfaceInterface {
    private methods;
    private extendedInterfacesName;
    private name;
    setName(name: string): this;
    getName(): string;
    addMethod(method: ReflectionMethodInterface): this;
    setMethods(methods: ReflectionMethodInterface[]): this;
    isExtensionOf(interfaceName: string): this;
    extends(className: string): boolean;
    getMethod(methodName: string): ReflectionMethodInterface;
    getMethods(): ReflectionMethodInterface[];
}
//# sourceMappingURL=ReflectionInterface.d.ts.map