import ReflectionMethodInterface from "./ReflectionMethodInterface";

export default interface ReflectionClassInterface {
    getName(): string;
    getMethod(methodName: string): ReflectionMethodInterface;
    getMethods(): ReflectionMethodInterface[];

    implements(interfaceName: string): boolean;
    extends(className: string): boolean;
}
