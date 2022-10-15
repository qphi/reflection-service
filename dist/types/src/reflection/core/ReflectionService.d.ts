import ReflectionMethodInterface from "../api/ReflectionMethodInterface";
import ReflectionClassInterface from "../api/ReflectionClassInterface";
import ReflectionClass from "./ReflectionClass";
import ReflectionInterfaceInterface from "../api/ReflectionInterfaceInterface";
declare type Class = {
    new (...args: any[]): any;
};
export default class ReflectionService {
    private dictionary;
    private typeToNamespaceMapping;
    private reflectionClasses;
    private reflectionInterfaces;
    constructor(classes: ReflectionClassInterface[], interfaces: ReflectionInterfaceInterface[]);
    recordClass(name: string, theClass: Class, meta?: ReflectionClass): this;
    addReflectionClass(reflectionClass: ReflectionClassInterface): this;
    addReflectionInterface(reflectionInterface: ReflectionInterfaceInterface): this;
    getReflectionClass(name: string): ReflectionClassInterface;
    getReflectionInterface(name: string): ReflectionInterfaceInterface;
    getReflectionInterfaces(): ReflectionInterfaceInterface[];
    getReflectionClasses(): ReflectionInterfaceInterface[];
    getReflectionMethod(resourceType: InstanceType<any>, methodName: string): ReflectionMethodInterface;
    getImplementationsOf(interfaceName: string): ReflectionClassInterface[];
    findClass(className: string): Class | undefined;
    isInterface(namespacedResourceName: string): boolean;
    isClass(namespacedResourceName: string): boolean;
    isKindOf(namespacedResourceName: string, kind: string): boolean;
    getNamespacedResourceName(resourceType: Class): string | null;
    /**
     * Inspired from: https://davidwalsh.name/javascript-arguments
     * @param func
     */
    getFunctionArgumentsName(func: Function): Array<string>;
    parseFunctionDefinition(functionDefinition: string): Array<string>;
}
export {};
//# sourceMappingURL=ReflectionService.d.ts.map