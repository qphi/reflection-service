import ReflectionParameterInterface from "./ReflectionParameterInterface";
export default interface ReflectionMethodInterface {
    getName(): string;
    isPublic(): boolean;
    isProtected(): boolean;
    isPrivate(): boolean;
    isAbstract(): boolean;
    isConstructor(): boolean;
    isStatic(): boolean;
    getParameters(): ReflectionParameterInterface[];
    getParameter(name: string): ReflectionParameterInterface;
}
//# sourceMappingURL=ReflectionMethodInterface.d.ts.map