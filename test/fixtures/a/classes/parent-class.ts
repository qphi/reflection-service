export default class ParentClass {
    // @ts-ignore
    private isToto: boolean = false;

    constructor(settings = {}) {
    }

    enableToto() {
        this.isToto = true;
    }

    disableToto() {
        this.isToto = false;
    }
}
