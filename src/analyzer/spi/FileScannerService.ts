import FileScannerInterface from "./FileScannerInterface";
import {scan} from 'dree';
import {Publisher} from "@qphi/publisher-subscriber";

export default class FileScannerService extends Publisher implements FileScannerInterface {
    private onFileFound: Function;

    scan(
        rootpath: string,
        exclude?: RegExp | RegExp[],
        extensions?: string[]
    ): void {
        scan(
            rootpath,
            {
                exclude,
                hash: false,
                depth: 10,
                size: false,
                extensions
            },

            file => {
                this.onFileFound(file)
            });
    }

    public setOnFileFoundHandler(callback: Function): this {
        this.onFileFound = callback;
        return this;
    }

}
