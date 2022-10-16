import VoidInterface from "./VoidInterface";

export default class SampleWithTypedArgument {
    // @ts-ignore: unused 
    private readonly param: VoidInterface;

    constructor(param: VoidInterface) {
        this.param = param;
    }
}
