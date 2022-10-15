import ReflectionParameterInterface from "../api/ReflectionParameterInterface";
import ReflectionMethodInterface from "../api/ReflectionMethodInterface";
import { ReflectionMethodVisibility } from "../api/ReflectionMethodVisibility";
export declare type ReflectionMethodConstructorPayload = {
    visibility: ReflectionMethodVisibility;
    isStatic: boolean;
    isAbstract: boolean;
    name: string;
    isConstructor: boolean;
    parameters: ReflectionParameterInterface[];
};
export default class ReflectionMethod implements ReflectionMethodInterface {
    private readonly visibility;
    private readonly _isStatic;
    private readonly _isAbstract;
    private readonly _isConstructor;
    private readonly name;
    private readonly parameters;
    constructor({ visibility, isStatic, isAbstract, isConstructor, parameters, name }: ReflectionMethodConstructorPayload);
    getName(): string;
    isAbstract(): boolean;
    isConstructor(): boolean;
    isPrivate(): boolean;
    isProtected(): boolean;
    isPublic(): boolean;
    isStatic(): boolean;
    getParameters(): ReflectionParameterInterface[];
    getParameter(name: string): ReflectionParameterInterface;
}
//# sourceMappingURL=ReflectionMethod.d.ts.map