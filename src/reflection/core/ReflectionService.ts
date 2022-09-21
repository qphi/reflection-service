// https://stackoverflow.com/questions/39392853/is-there-a-type-for-class-in-typescript-and-does-any-include-it
import {CodeElementMetadata, InheritanceTree} from "../../analyzer/api/types";
import {GET_EMPTY_INHERITANCE_TREE} from "../../analyzer/core/InheritanceTreeService";
import {IS_CLASS, IS_INTERFACE} from "../../analyzer/api/settings";
import ReflectionMethodInterface from "../api/ReflectionMethodInterface";
import {GET_EMPTY_CODE_ELEMENT_DATA} from "../../analyzer/core/CodeAnalyzerService";
import ReflectionClassInterface from "../api/ReflectionClassInterface";
import {InvalidArgumentException} from "@qphi/publisher-subscriber";

type Class = { new(...args: any[]): any; };


export default class ReflexionService {
    private meta: Record<string, CodeElementMetadata> = {};
    private inheritanceTree: InheritanceTree = GET_EMPTY_INHERITANCE_TREE();
    private dictionary: Map<string, Class> = new Map<string, Class>();
    private typeToNamespaceMapping: Map<Class, string> = new Map<Class, string>();

    private reflectionClasses: Record<string, ReflectionClassInterface> = {};

    public recordClass(name: string, theClass: Class, meta?: CodeElementMetadata): this {
        this.dictionary.set(name, theClass);
        this.typeToNamespaceMapping.set(theClass, name);
        if (meta) {
            this.setCodeElementMeta(name, meta);
        } else {
            this.setCodeElementMeta(name, this.buildDefaultCodeElementMeta(name, IS_CLASS));
        }

        return this;
    }

    private buildDefaultCodeElementMeta(name: string, kind: string): CodeElementMetadata {
        return {
            ...GET_EMPTY_CODE_ELEMENT_DATA(),
            ...{
                kind: IS_CLASS,
                name
            }
        };
    }

    public addReflectionClass(reflectionClass: ReflectionClassInterface): this {
        this.reflectionClasses[reflectionClass.getName()] = reflectionClass;
        return this;
    }

    public getReflectionClass(name: string): ReflectionClassInterface {
        const _class = this.reflectionClasses[name];

        if (_class === null) {
            throw new InvalidArgumentException(
                `Unable to find ReflectionClass for class "${_class}"`
            );
        }

        return _class;
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

    public setCodeElementMeta(name: string, meta: CodeElementMetadata): this {
        this.meta[name] = meta;
        return this;
    }

    public setInheritanceTree(tree: InheritanceTree): void {
        this.inheritanceTree = tree;
    }

    public getImplementationsOf(interfaceName: string): string[] {
        if (this.meta[interfaceName]?.kind !== IS_INTERFACE) {
            // todo dedicated error class + check if its class + check typo
            throw `Interface "${interfaceName}" was not found.`;
        }


        return Object.keys(this.inheritanceTree.implementsInterface).filter(entry => {
            return this.isClass(entry) && this.inheritanceTree.implementsInterface[entry].includes(interfaceName);
        });
    }

    public findClass(className: string): Class | undefined {
        switch (className) {
            case 'Object':
                return Object;
            default:
                const candidate = this.dictionary.get(className);
                return this.meta[className]?.kind === 'class' ? candidate : undefined;
        }
    }

    public isInterface(namespacedResourceName): boolean {
        return this.meta[namespacedResourceName]?.kind === IS_INTERFACE;
    }

    public isClass(namespacedResourceName): boolean {
        return this.meta[namespacedResourceName]?.kind === IS_CLASS;
    }

    public isKindOf(namespacedResourceName: string, kind: string): boolean {
        return this.meta[namespacedResourceName]?.kind === kind;
    }

    public getNamespacedResourceName(resourceType: Class): string | null {
        return this.typeToNamespaceMapping.get(resourceType) ?? null
    }

    public getConstructorOf(namespacedResourceName: string): CodeElementMetadata | undefined {
        return this.meta[namespacedResourceName];
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
