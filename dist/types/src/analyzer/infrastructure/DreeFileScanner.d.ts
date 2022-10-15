import FileScannerInterface from "../spi/FileScannerInterface";
import { Publisher } from "@qphi/publisher-subscriber";
export default class DreeFileScanner extends Publisher implements FileScannerInterface {
    constructor();
    scan(rootpath: string, exclude?: RegExp | RegExp[], extensions?: string[]): void;
}
//# sourceMappingURL=DreeFileScanner.d.ts.map