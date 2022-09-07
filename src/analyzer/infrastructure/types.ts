import {ClassDeclaration, TSInterfaceDeclaration} from "@babel/types";

export type ClassDeclarationWrapper = {
    node: ClassDeclaration,
    parentNodeType: string
}

export type InterfaceDeclarationWrapper = {
    node: TSInterfaceDeclaration,
    parentNodeType: string
}
