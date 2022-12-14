import ReflectionClassInterface from "../api/ReflectionClassInterface";
import ReflectionMethodInterface from "../api/ReflectionMethodInterface";
import {InvalidArgumentException} from "@qphi/publisher-subscriber";


export default class ReflectionClass implements ReflectionClassInterface {
    private methods: ReflectionMethodInterface[] = [];
    private implementedInterfacesName: Set<string> = new Set<string>();
    private extendedClassesName: Set<string> = new Set<string>();
    private _isAbstract: boolean = false;
    private filePath: string = '';
    private name: string = '';
    private classProvider: () => any = () => undefined;

    public setName(name: string): this {
        this.name = name;
        return this;
    }

    public getClass(): any {
        return this.classProvider();
    }

    public setClassProvider(provider: () => any): this {
        this.classProvider = provider;
        return this;
    }

    public getName(): string {
        return this.name;
    }

    public setAbstract(value: boolean): this {
        this._isAbstract = value;
        return this;
    }

    public addMethod(method: ReflectionMethodInterface): this {
        this.methods.push(method);
        return this;
    }

    public setMethods(methods: ReflectionMethodInterface[]): this {
        this.methods = methods;
        return this;
    }

    public isImplementationOf(interfaceName: string): this {
        this.implementedInterfacesName.add(interfaceName);
        return this;
    }

    public isExtensionOf(className: string): this {
        this.extendedClassesName.add(className);
        return this;
    }

    public implements(interfaceName: string): boolean {
        return this.implementedInterfacesName.has(interfaceName);
    }

    public extends(className: string): boolean {
        return this.extendedClassesName.has(className);
    }

    public getMethod(methodName: string): ReflectionMethodInterface {
        const method = this.methods.find(reflectionMethod => reflectionMethod.getName() === methodName);

        if (typeof method === 'undefined') {
            throw new InvalidArgumentException(`No method "${methodName}" found in class "${this.getName()}"`)
        }

        return method;
    }

    hasMethod(methodName: string): boolean {
        const method = this.methods.find(reflectionMethod => reflectionMethod.getName() === methodName);
        return typeof method !== 'undefined';
    }

    public getMethods(): ReflectionMethodInterface[] {
        return this.methods;
    }


    public isAbstract(): boolean {
        return this._isAbstract;
    }

    public getFilePath(): string {
        return this.filePath;
    }

    public setFilePath(filePath: string): this {
        this.filePath = filePath;
        return this;
    }
}
