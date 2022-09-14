import {ReflectionMethodVisibility} from "../../reflection/api/ReflectionMethodVisibility";

export type ObjectLocation = {
    name: string,
    namespace: string
}

export type CodeElementMetadata = {
    kind: string,
    namespace: string,
    name: string,
    implements: ObjectLocation[],
    methods: Record<string, MethodMetadata>,
    imports: any,
    export: {
        type: string,
        path: string
    }
}

export type ParameterMetadata = {
    name: string,
    namespace?: string,
    optional: boolean,
    position: number,
    type: string,
    defaultValue: any
};

export type MethodMetadata = {
    abstract: boolean,
    static: boolean,
    computed: boolean,
    async: boolean,
    name: string,
    parameters: ParameterMetadata[],
    visibility: ReflectionMethodVisibility,
    returnType: string
}

export type AliasRule = {
    replace: string | RegExp,
    by: string
}

export type CodeAnalyzeSettings = {
    separator?: string,
    path: string,
    exclude?: RegExp | RegExp[],
    debug?: boolean,
    aliasRules?: AliasRule[],
    extensions?: string[]
}

export type ClassMetadata = CodeElementMetadata & {
    superClass: ObjectLocation | null,
    abstract: boolean,
    constructor: ParameterMetadata[],
    kind: 'class'
}

export type InterfaceMetadata = CodeElementMetadata & {
    kind: 'interface'
}

export type ScannedFile = {
    filePath: string,
    content: string
}


