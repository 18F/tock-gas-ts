import { expect } from 'chai';

import * as util from '../src/util';

describe('getFunctionName()', () => {
    it('works', () => {
        expect(util.getFunctionName(function boop() {}))
          .to.eq('boop');
    });

    it('throws error if function has no name', () => {
        expect(() => {
            util.getFunctionName(() => {})
        }).to.throw(/has no name$/);
    });
});

describe('normalizeDateToString', () => {
    const { normalizeDateToString } = util;

    it('trims strings', () => {
        expect(normalizeDateToString(' 2018-01-01 ')).to.eql('2018-01-01');
    });

    it('converts Dates to strings', () => {
        expect(normalizeDateToString(new Date(2018, 0, 2))).to.eql('2018-01-02');
        expect(normalizeDateToString(new Date(2018, 1, 21))).to.eql('2018-02-21');
        expect(normalizeDateToString(new Date(2018, 11, 2))).to.eql('2018-12-02');
    });
});

describe('isDateStringValid', () => {
    it('returns true when date is YYYY-MM-DD', () => {
        expect(util.isDateStringValid('2018-01-01')).to.be.true;
    });

    it('returns false when date is not YYYY-MM-DD', () => {
        expect(util.isDateStringValid('2018-01-O1')).to.be.false;
    });
});

describe('toDate', () => {
    it('works', () => {
        const date = util.toDate('2018-01-14');

        expect(date).to.be.an.instanceof(Date);
        expect(date.getFullYear()).to.eql(2018);
        expect(date.getMonth()).to.eql(0);
        expect(date.getDate()).to.eql(14);
    });
});

describe('toCellTypeArray', () => {
    it('wraps primitive types in an array if needed', () => {
        expect(util.toCellTypeArray(1)).to.eql([1]);
        expect(util.toCellTypeArray(true)).to.eql([true]);
        expect(util.toCellTypeArray('blah')).to.eql(['blah']);

        const date = new Date();
        expect(util.toCellTypeArray(date)).to.eql([date]);
    });

    it('throws errors on unexpected types', () => {
        expect(() => {
            util.toCellTypeArray(null);
        }).to.throw('Unexpected cell type: null (object)');
    });

    it('leaves one dimensional arrays unchanged', () => {
        expect(util.toCellTypeArray([1])).to.eql([1]);
    });

    it('flattens multi-dimensional arrays', () => {
        expect(util.toCellTypeArray([[1], [2]])).to.eql([1, 2]);
    });
});
