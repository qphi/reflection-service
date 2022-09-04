import {CodeAnalyzeSettings, CodeElementMetadata} from "../api/types";
import CodeAnalyzerInterface from "../api/CodeAnalyzerInterface";
import {resolve} from "path";
import {readFileSync, writeFile} from "fs";
import FileAnalyzerInterface from "../spi/FileAnalyzerInterface";
import FileScannerInterface from "../spi/FileScannerInterface";
import {ParseResult} from "@babel/parser";

export default class CodeAnalyzerService implements CodeAnalyzerInterface {
    private readonly analyzer: FileAnalyzerInterface;
    private readonly scanner: FileScannerInterface;

    constructor(scanner: FileScannerInterface, analyzer: FileAnalyzerInterface) {
        this.scanner = scanner;
        this.analyzer = analyzer;
    }

    public analyze({
       path,
       exclude = /node_modules/,
       debug = false,
       separator = '/',
       aliasRules = [
           {
               replace: __dirname,
               by: 'App'
           }
       ],
       extensions = ['ts']
    }: CodeAnalyzeSettings): Record<string, CodeElementMetadata> {
        const projectMetadata: Record<string, CodeElementMetadata> = {};
        const projectFiles = this.scanner.scan(
            resolve(path),
                exclude,
                extensions
        );

        projectFiles.forEach(element => {
                const content = readFileSync(element.path, 'utf-8');
                const fileMeta = this.analyzer.fromContent(
                    content,
                    {
                        filepath: element.path,
                        separator,
                        rewriteRules: aliasRules
                    }
                );

                projectMetadata[fileMeta.name] = fileMeta;


        if (debug === true) {
            writeFile(
                'resolved-meta-class.json',
                JSON.stringify(projectMetadata, null, 4),
                err => {
                    console.error(err)
                }
            );
        }

        return projectMetadata;
    }
}
