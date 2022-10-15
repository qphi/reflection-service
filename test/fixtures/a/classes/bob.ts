import ParentClass from "./parent-class";
import BobInterface from "./bobInterface";
import FooInterface from "./FooInterface";

export default class Bob extends ParentClass implements BobInterface, FooInterface {
    constructor(settings = {}) {
        super(settings);
    }

    someFunction(p1: unknown) {

    }
}
