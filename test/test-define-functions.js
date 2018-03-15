const { expect } = require('chai');

const df = require('../build/define-functions');

const CUSTOM_SUM_JSDOCS = `
/**
 * Add two numbers.
 *
 * @param {number} a The first number.
 * @param {number} b The second number.
 *
 * @return The sum of the numbers.
 * @customfunction
 */
`.trim();

const CUSTOM_SUM_TS = `
${CUSTOM_SUM_JSDOCS}
export function customSum(a: number, b: number): number {
    return a + b;
}
`.trim();

describe("extractFuncArgs", () => {
    it("works", () => {
        expect(df.extractFuncArgs('function boop(a: flarg, b) {}'))
          .to.eql(['a', 'b']);
    });
});

describe("extractFunctionInfo", () => {
    it("works", () => {
        const info = df.extractFunctionInfo(CUSTOM_SUM_TS);
        expect(info).to.eql({
            customSum: {
                name: 'customSum',
                args: ['a', 'b'],
                jsdocs: CUSTOM_SUM_JSDOCS + '\n'
            }
        });
    });
});
