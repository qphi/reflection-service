export default interface ReflectionParameterInterface {
    getName(): string;
    getPosition(): number;
    getType(): string | undefined;
    getNamespacedName(): string;
    isDefaultValueAvailable(): boolean;
    getDefaultValue(): any;
    isOptional(): boolean;
}
//# sourceMappingURL=ReflectionParameterInterface.d.ts.map