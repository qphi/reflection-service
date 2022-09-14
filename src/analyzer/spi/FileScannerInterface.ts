import {PublisherInterface} from "@qphi/publisher-subscriber";

export const FILE_CONTENT_AVAILABLE = 'file-content-available';

export default interface FileScannerInterface extends PublisherInterface {
    /**
     *   publish [FILE_CONTENT_AVAILABLE] notification on file found
     */

    scan(
        rootpath: string,
        exclude?: RegExp | RegExp[],
        extensions?: string[]
    ): void
}
