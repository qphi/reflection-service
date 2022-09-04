export default interface FileScannerInterface {
    scan(
        rootpath: string,
        exclude?: RegExp | RegExp[],
        extensions?: string[]
    )
}
