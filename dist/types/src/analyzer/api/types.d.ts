import { ReflectionMethodVisibility } from "../../reflection/api/ReflectionMethodVisibility";
import ReflectionInterfaceInterface from "../../reflection/api/ReflectionInterfaceInterface";
import ReflectionClassInterface from "../../reflection/api/ReflectionClassInterface";
export declare type ObjectLocation = {
    name: string;
    namespace: string;
};
export declare type CodeElementMetadata = {
    kind: string;
    namespace: string;
    name: string;
    implements: ObjectLocation[];
    methods: Record<string, MethodMetadata>;
    imports: any;
    export: {
        type: string;
        path: string;
    };
};
export declare type ParameterMetadata = {
    name: string;
    namespace?: string;
    optional: boolean;
    position: number;
    type: string;
    defaultValue: any;
};
export declare type MethodMetadata = {
    abstract: boolean;
    static: boolean;
    computed: boolean;
    async: boolean;
    name: string;
    parameters: ParameterMetadata[];
    visibility: ReflectionMethodVisibility;
    returnType: string;
};
export declare type AliasRule = {
    replace: string | RegExp;
    by: string;
};
export declare type CodeAnalyzeSettings = {
    separator?: string;
    path: string;
    exclude?: RegExp | RegExp[];
    debug?: boolean;
    aliasRules?: AliasRule[];
    extensions?: string[];
};
export declare type ClassMetadata = CodeElementMetadata & {
    superClass: ObjectLocation | null;
    abstract: boolean;
    constructor: ParameterMetadata[];
    kind: 'class';
};
export declare type InterfaceMetadata = CodeElementMetadata & {
    kind: 'interface';
};
export declare type ScannedFile = {
    filePath: string;
    content: string;
};
export declare type InheritanceTree = {
    extendsClass: Record<string, string[]>;
    implementsInterface: Record<string, string[]>;
};
export declare type ProjectMetadata = {
    interfaces: ReflectionInterfaceInterface[];
    classes: ReflectionClassInterface[];
    inheritanceTree: InheritanceTree;
};
//# sourceMappingURL=types.d.ts.map