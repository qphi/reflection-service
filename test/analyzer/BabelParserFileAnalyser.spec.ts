import {describe, it} from 'mocha';
import BabelParserFileAnalyzer from "../../src/analyzer/infrastructure/BabelParserFileAnalyzer";
import NamespaceMapperService from "../../src/analyzer/core/NamespaceMapperService";
import ObjectLocalizerService from "../../src/analyzer/core/ObjectLocalizerService";
import {expect} from "chai";
import {IS_INTERFACE} from "../../src/analyzer/api/settings";

function createFileAnalyzer() {
    return new BabelParserFileAnalyzer(
        new NamespaceMapperService(),
        new ObjectLocalizerService()
    );
}

describe('Testing generateClassesMetadata function with real files', () => {
    it('VoidInterface', () => {
        const babelFileAnalyzer = createFileAnalyzer();
        const codeElementMetadata = babelFileAnalyzer.fromContent(
        `export default interface VoidInterface {}
        `,
        {
            filepath: 'VoidInterface.ts',
            separator: '/',
            rewriteRules: []
        });

        expect(Array.isArray(codeElementMetadata)).to.be.true;
        expect(codeElementMetadata.length).to.equals(1);
        const meta = codeElementMetadata[0];
        expect(meta.kind).to.equals(IS_INTERFACE);
        expect(meta.namespace).to.equals('');
        expect(Array.isArray(meta.implements)).to.be.true;
        expect(meta.implements.length).to.equals(0);
        expect(meta.name).to.equals('VoidInterface');
        expect(JSON.stringify(meta.methods)).to.equals('{}');
        expect(Array.isArray(meta.imports)).to.be.true;
        expect(meta.imports.length).to.equals(0);

        expect(JSON.stringify(meta.export)).to.equals('{"path":"VoidInterface.ts","type":"export:default"}');
    });
});
