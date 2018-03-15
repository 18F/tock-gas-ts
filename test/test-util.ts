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
