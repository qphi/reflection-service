import ReflectionMethodInterface from "./ReflectionMethodInterface";

export default interface ReflectionInterfaceInterface {
    getName(): string;
    getMethod(methodName: string): ReflectionMethodInterface;
    getMethods(): ReflectionMethodInterface[];
    extends(className: string): boolean;
}

