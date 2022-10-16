// https://stackoverflow.com/questions/39392853/is-there-a-type-for-class-in-typescript-and-does-any-include-it
import {IS_CLASS, IS_INTERFACE} from "../../analyzer/api/settings";
import ReflectionMethodInterface from "../api/ReflectionMethodInterface";
import ReflectionClassInterface from "../api/ReflectionClassInterface";
import {InvalidArgumentException} from "@qphi/publisher-subscriber";
import ReflectionClass from "./ReflectionClass";
import ReflectionInterfaceInterface from "../api/ReflectionInterfaceInterface";

type Class = { new(...args: any[]): any; };


export default class ReflectionService {
    // private inheritanceTree: InheritanceTree = GET_EMPTY_INHERITANCE_TREE();
    private dictionary: Map<string, Class> = new Map<string, Class>();
    private typeToNamespaceMapping: Map<Class, string> = new Map<Class, string>();

    private reflectionClasses: Record<string, ReflectionClassInterface> = {};
    private reflectionInterfaces: Record<string, ReflectionInterfaceInterface> = {};

    constructor(
        classes: ReflectionClassInterface[],
        interfaces: ReflectionInterfaceInterface[],
        // inheritanceTree: InheritanceTree
    ) {

        classes.forEach(_class => {
            this.addReflectionClass(_class);
        });

        interfaces.forEach(_interface => {
            this.addReflectionInterface(_interface);
        });

        // this.setInheritanceTree(inheritanceTree);
    }
    public recordClass(name: string, theClass: Class, meta?: ReflectionClass): this {
        this.dictionary.set(name, theClass);
        this.typeToNamespaceMapping.set(theClass, name);

        if (meta) {
            this.reflectionClasses[name] = meta;
        } else {
            if (typeof this.reflectionClasses[name] === 'undefined') {
                this.reflectionClasses[name] = (new ReflectionClass()).setName(name);
            }
        }

        return this;
    }

    public addReflectionClass(reflectionClass: ReflectionClassInterface): this {
        this.reflectionClasses[reflectionClass.getName()] = reflectionClass;
        return this;
    }

    public addReflectionInterface(reflectionInterface: ReflectionInterfaceInterface): this {
        this.reflectionInterfaces[reflectionInterface.getName()] = reflectionInterface;
        return this;
    }

    public getReflectionClass(name: string): ReflectionClassInterface {
        const _class = this.reflectionClasses[name];

        if (_class === null) {
            throw new InvalidArgumentException(
                `Unable to find ReflectionClass for class "${name}"`
            );
        }

        return _class;
    }

    public getReflectionInterface(name: string): ReflectionInterfaceInterface {
        const _interface = this.reflectionInterfaces[name];

        if (_interface === null) {
            throw new InvalidArgumentException(
                `Unable to find ReflectionInterface for interface "${name}"`
            );
        }

        return _interface;
    }

    public getReflectionInterfaces(): ReflectionInterfaceInterface[] {
        return Object.values(this.reflectionInterfaces);
    }

    public getReflectionClasses(): ReflectionInterfaceInterface[] {
        return Object.values(this.reflectionClasses);
    }

    public getReflectionMethod(resourceType: InstanceType<any>, methodName: string): ReflectionMethodInterface {
        const namespacedResourceName = this.getNamespacedResourceName(resourceType);
        if (namespacedResourceName === null) {
            // todo throw dedicated error
            throw `Cannot find method "${methodName}" of resource "${resourceType.constructor.name}". No namespace was bind to this resource.`;
        }

        try {
            const reflectionClass = this.getReflectionClass(namespacedResourceName);
            return reflectionClass.getMethod(methodName);
        } catch (error) {
            if (error instanceof InvalidArgumentException) {
                error.message += ` Resolved from "${resourceType}" class name.`;
            }

            throw error;
        }
    }

    // public setInheritanceTree(tree: InheritanceTree): void {
    //     this.inheritanceTree = tree;
    // }

    public getClassImplementationsOf(interfaceName: string): ReflectionClassInterface[] {
        return Object.values(this.reflectionClasses).filter(_class => _class.implements(interfaceName));
    }

    public getClassExtensionOf(className: string): ReflectionClassInterface[] {
        return Object.values(this.reflectionClasses).filter(_class => _class.extends(className));
    }

    public findClass(className: string): Class | undefined {
        switch (className) {
            case 'Object':
                return Object;
            default:
                const candidate = this.dictionary.get(className);
                return this.reflectionClasses[className] ? candidate : undefined;
        }
    }

    public isInterface(namespacedResourceName: string): boolean {
        return typeof this.reflectionInterfaces[namespacedResourceName] !== 'undefined';
    }

    public isClass(namespacedResourceName: string): boolean {
        return typeof this.reflectionClasses[namespacedResourceName] !== 'undefined';
    }

    public isKindOf(namespacedResourceName: string, kind: string): boolean {
        switch (kind) {
            case IS_INTERFACE:
                return typeof this.reflectionInterfaces[namespacedResourceName] !== 'undefined';
            case IS_CLASS:
                return typeof this.reflectionClasses[namespacedResourceName] !== 'undefined';
            default:
                return false;
        }
        ;
    }

    public getNamespacedResourceName(resourceType: Class): string | null {
        return this.typeToNamespaceMapping.get(resourceType) ?? null
    }


    /**
     * Inspired from: https://davidwalsh.name/javascript-arguments
     * @param func
     */
    public getFunctionArgumentsName(func: Function): Array<string> {
        return this.parseFunctionDefinition(func.toString());
    }

    public parseFunctionDefinition(functionDefinition: string): Array<string> {
        const tokens = functionDefinition.match(/function\s.*?\(([^)]*)\)/) || [];

        if (tokens.length < 1) {
            return tokens;
        }

        const name = tokens[0];
        const args = tokens[1];

        // Split the arguments string into an array comma delimited.
        return [name].concat(args.split(',').map(function (arg) {
            // Ensure no inline comments are parsed and trim the whitespace.
            return arg.replace(/\/\*.*\*\//, '').trim();
        }).filter(function (arg) {
            // Ensure no undefined values are added.
            return arg;
        }));
    }
}
