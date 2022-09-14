import FileScannerInterface, {FILE_CONTENT_AVAILABLE} from "../spi/FileScannerInterface";
import {scan as dreeScan} from 'dree';
import {Publisher} from "@qphi/publisher-subscriber";
import {readFileSync} from "fs";
import {randomBytes} from "crypto";

export default class DreeFileScanner extends Publisher implements FileScannerInterface {
    constructor() {
        super('dree-file-scanner-' + randomBytes(4));
    }

    public scan(rootpath: string, exclude?: RegExp | RegExp[], extensions?: string[]): void {
        dreeScan(
            rootpath,
            {
                exclude,
                hash: false,
                depth: 10,
                extensions
            },

            file => {
                const content = readFileSync(file.path, 'utf-8');
                this.publish(FILE_CONTENT_AVAILABLE, {
                    filePath: file.path,
                    content
                });
            }
        );
    }
}
