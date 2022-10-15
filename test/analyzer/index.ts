import ProjectAnalyzer from "../../src/services/ProjectAnalyzer";
import {resolve} from "path";
import ReflectionClass from "../../src/reflection/core/ReflectionClass";
import ReflectionService from "../../src/reflection/core/ReflectionService";

const analyser = new ProjectAnalyzer();
analyser.analyze({
    path: resolve(__dirname, '../fixtures'),
    aliasRules: [
        {
            replace: resolve(__dirname, '../fixtures'),
            by: '@fixtures'
        }
    ]
}).then(result => {
    // console.log(result);
    const reflectionService = new ReflectionService(
        result.classes,
        result.interfaces,
        result.inheritanceTree
    );
    // const reflectionClasses = analyser.codeElementToReflectionClasses(result);
    console.log(reflectionService);
})

