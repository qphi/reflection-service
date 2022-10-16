import ReflectionParameterInterface from "../api/ReflectionParameterInterface";
export declare type ReflectionParameterConstructorPayload = {
    name: string;
    namespace?: string;
    position: number;
    defaultValue: any;
    optional: boolean;
    type?: string;
};
export default class ReflectionParameter implements ReflectionParameterInterface {
    private readonly name;
    private readonly position;
    private readonly defaultValue;
    private readonly optional;
    private readonly type?;
    private readonly namespacedName;
    constructor({ name, position, defaultValue, type, optional, namespace }: ReflectionParameterConstructorPayload);
    getName(): string;
    getNamespacedName(): string;
    getPosition(): number;
    getType(): string | undefined;
    isDefaultValueAvailable(): boolean;
    getDefaultValue(): any;
    isOptional(): boolean;
}
//# sourceMappingURL=ReflectionParameter.d.ts.map