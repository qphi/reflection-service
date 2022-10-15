import ReflectionMethodInterface from "../api/ReflectionMethodInterface";
import {InvalidArgumentException} from "@qphi/publisher-subscriber";
import ReflectionInterfaceInterface from "../api/ReflectionInterfaceInterface";


export default class ReflectionInterface implements ReflectionInterfaceInterface {
    private methods: ReflectionMethodInterface[] = [];
    private extendedInterfacesName: Set<string> = new Set<string>();
    private name: string = '';

    public setName(name: string): this {
        this.name = name;
        return this;
    }

    public getName(): string {
        return this.name;
    }

    public addMethod(method: ReflectionMethodInterface): this {
        this.methods.push(method);
        return this;
    }

    public setMethods(methods: ReflectionMethodInterface[]): this {
        this.methods = methods;
        return this;
    }

    public isExtensionOf(interfaceName: string): this {
        this.extendedInterfacesName.add(interfaceName);
        return this;
    }

    public extends(className: string): boolean {
        return this.extendedInterfacesName.has(className);
    }

    public getMethod(methodName: string): ReflectionMethodInterface {
        const method = this.methods.find(reflectionMethod => reflectionMethod.getName() === methodName);

        if (typeof method === 'undefined') {
            throw new InvalidArgumentException(`No method "${methodName}" found in interface "${this.getName()}"`)
        }

        return method;
    }

    public getMethods(): ReflectionMethodInterface[] {
        return this.methods;
    }
}
