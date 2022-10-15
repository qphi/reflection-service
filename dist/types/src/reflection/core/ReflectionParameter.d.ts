import ReflectionParameterInterface from "../api/ReflectionParameterInterface";
export declare type ReflectionParameterConstructorPayload = {
    name: string;
    position: number;
    defaultValue: any;
    optional: boolean;
};
export default class ReflectionParameter implements ReflectionParameterInterface {
    private readonly name;
    private readonly position;
    private readonly defaultValue;
    private readonly optional;
    constructor({ name, position, defaultValue, optional }: ReflectionParameterConstructorPayload);
    getName(): string;
    getPosition(): number;
    isDefaultValueAvailable(): boolean;
    getDefaultValue(): any;
    isOptional(): boolean;
}
//# sourceMappingURL=ReflectionParameter.d.ts.map