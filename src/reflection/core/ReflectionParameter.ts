import ReflectionParameterInterface from "../api/ReflectionParameterInterface";


export type ReflectionParameterConstructorPayload = {
    name: string,
    namespace?: string,
    position: number,
    defaultValue: any,
    optional: boolean,
    type?: string
}
export default class ReflectionParameter implements ReflectionParameterInterface {
    private readonly name: string;
    private readonly position: number; // todo
    private readonly defaultValue: any;// todo
    private readonly optional: boolean;
    private readonly type?: string;
    private readonly namespacedName: string;

    constructor({
                    name,
                    position,
                    defaultValue,
                    type,
                    optional,
                    namespace
                }: ReflectionParameterConstructorPayload
    ) {
        this.name = name;
        this.position = position;
        this.defaultValue = defaultValue;
        this.optional = optional;
        this.type = type;
        this.namespacedName = namespace ?? this.name;
    }

    public getName(): string {
        return this.name;
    }

    public getNamespacedName(): string {
        return this.namespacedName;
    }

    public getPosition(): number {
        return this.position;
    }

    public getType(): string | undefined {
        return this.type;
    }

    public isDefaultValueAvailable(): boolean {
        return typeof this.defaultValue !== 'undefined';
    }

    public getDefaultValue(): any {
        return this.defaultValue;
    }

    public isOptional(): boolean {
        return this.optional;
    }
}
