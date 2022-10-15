import FileScannerInterface from "./FileScannerInterface";
import { Publisher } from "@qphi/publisher-subscriber";
export default class FileScannerService extends Publisher implements FileScannerInterface {
    private onFileFound;
    scan(rootpath: string, exclude?: RegExp | RegExp[], extensions?: string[]): void;
    setOnFileFoundHandler(callback: Function): this;
}
//# sourceMappingURL=FileScannerService.d.ts.map