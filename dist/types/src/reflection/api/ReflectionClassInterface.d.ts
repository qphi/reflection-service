import ReflectionMethodInterface from "./ReflectionMethodInterface";
export default interface ReflectionClassInterface {
    getName(): string;
    getMethod(methodName: string): ReflectionMethodInterface;
    hasMethod(methodName: string): boolean;
    getMethods(): ReflectionMethodInterface[];
    isAbstract(): boolean;
    getFilePath(): string;
    getClass(): any;
    implements(interfaceName: string): boolean;
    extends(className: string): boolean;
}
//# sourceMappingURL=ReflectionClassInterface.d.ts.map