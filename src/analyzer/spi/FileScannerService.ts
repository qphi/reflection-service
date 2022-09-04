import FileScannerInterface from "./FileScannerInterface";
import {scan} from 'dree';
import {resolve} from "path";
export default class FileScannerService implements FileScannerInterface {
    private onFileFound: Function;

    scan(
        rootpath: string,
        exclude,
        extensions
    ) {
        const filesFound = [];
        return scan(
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
