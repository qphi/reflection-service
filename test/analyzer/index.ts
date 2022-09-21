import ProjectAnalyzer from "../../src/services/ProjectAnalyzer";
import {resolve} from "path";

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
    console.log(result);
    // const reflectionClasses = analyser.codeElementToReflectionClasses(result);
    // console.log(reflectionClasses);
})

