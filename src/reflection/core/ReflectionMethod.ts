import ReflectionParameterInterface from "../api/ReflectionParameterInterface";
import ReflectionMethodInterface from "../api/ReflectionMethodInterface";
import {ReflectionMethodVisibility} from "../api/ReflectionMethodVisibility";

export type ReflectionMethodConstructorPayload = {
    visibility: ReflectionMethodVisibility,
    isStatic: boolean,
    isAbstract: boolean,
    name: string,
    isConstructor: boolean,
    parameters: ReflectionParameterInterface[]
};


export default class ReflectionMethod implements ReflectionMethodInterface {
    private readonly visibility: ReflectionMethodVisibility;
    private readonly _isStatic: boolean;
    private readonly _isAbstract: boolean;
    private readonly _isConstructor: boolean;
    private readonly name: string;
    private readonly parameters: ReflectionParameterInterface[];

    constructor({visibility, isStatic, isAbstract, isConstructor, parameters, name}: ReflectionMethodConstructorPayload) {
        this.visibility = visibility;
        this._isStatic = isStatic;
        this._isAbstract = isAbstract;
        this._isConstructor = isConstructor;
        this.name = name;
        this.parameters = parameters;
    }

    public getName(): string {
        return this.name;
    }

    public isAbstract(): boolean {
        return this._isAbstract;
    }

    public isConstructor(): boolean {
        return this._isConstructor;
    }

    public isPrivate(): boolean {
        return this.visibility === ReflectionMethodVisibility.PRIVATE;
    }

    public isProtected(): boolean {
        return this.visibility === ReflectionMethodVisibility.PROTECTED;
    }

    public isPublic(): boolean {
        return this.visibility === ReflectionMethodVisibility.PUBLIC;
    }

    public isStatic(): boolean {
        return this._isStatic;
    }

    public getParameters(): ReflectionParameterInterface[] {
        return this.parameters;
    }

    public getParameter(name: string): ReflectionParameterInterface {
        const parameter = this.parameters.find(parameter => parameter.getName() === name);
        if (!parameter) {
            // todo inject name + dedicated error
            throw `Unable to find parameter "${name}" in method ""`
        }

        return parameter;
    }
}
