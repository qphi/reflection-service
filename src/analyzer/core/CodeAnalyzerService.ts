import {AliasRule, CodeAnalyzeSettings, CodeElementMetadata, ScannedFile} from "../api/types";
import CodeAnalyzerInterface from "../api/CodeAnalyzerInterface";
import {resolve} from "path";
import {writeFile} from "fs";
import FileAnalyzerInterface from "../spi/FileAnalyzerInterface";
import FileScannerInterface, {FILE_CONTENT_AVAILABLE} from "../spi/FileScannerInterface";
import {Subscriber, SubscriberInterface} from "@qphi/publisher-subscriber";
import {randomBytes} from "crypto";

export type ScanningContext = {
    separator: string,
    rewriteRules: AliasRule[]
}

export default class CodeAnalyzerService implements CodeAnalyzerInterface {
    private readonly analyzer: FileAnalyzerInterface;
    private readonly scanner: FileScannerInterface;
    private readonly subscriber: SubscriberInterface;

    private projectMetadata: Record<string, CodeElementMetadata> = {};
    private context: ScanningContext;

    constructor(scanner: FileScannerInterface, analyzer: FileAnalyzerInterface) {
        this.scanner = scanner;
        this.analyzer = analyzer;

        this.subscriber = new Subscriber('code-analyzer-' + randomBytes(4));
        this.bindServicesTogether();
    }

    private bindServicesTogether(): void {
        this.subscriber.subscribe(
            this.scanner,
            FILE_CONTENT_AVAILABLE,
            (scannedFile: ScannedFile) => {
                this.analyseScannedFile(scannedFile);
            }
        )
    }

    public async analyze({
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
                         }: CodeAnalyzeSettings): Promise<Record<string, CodeElementMetadata>> {
        this.context = {
            separator,
            rewriteRules: aliasRules
        };

        this.scanner.scan(
            resolve(path),
            exclude,
            extensions
        );


        // writeFile(
        //     'resolved-meta-class.json',
        //     JSON.stringify(this.projectMetadata, null, 4),
        //     err => {
        //         console.error(err)
        //     }
        // );


        return this.projectMetadata;
    }

    protected analyseScannedFile(scannedFile: ScannedFile): void {
        const fileMeta: CodeElementMetadata[] = this.analyzer.fromContent(
            scannedFile.content,
            {
                filepath: scannedFile.filePath,
                ...this.context
            }
        );

        fileMeta.forEach(meta => {
            this.projectMetadata[meta.name] = meta;
        });
    }
}
