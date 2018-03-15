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

describe('normalizeDate', () => {
    const { normalizeDate } = util;

    it('trims strings', () => {
        expect(normalizeDate(' 2018-01-01 ')).to.eql('2018-01-01');
    });

    it('converts Dates to strings', () => {
        expect(normalizeDate(new Date(2018, 1, 2))).to.eql('2018-01-02');
        expect(normalizeDate(new Date(2018, 1, 21))).to.eql('2018-01-21');
        expect(normalizeDate(new Date(2018, 11, 2))).to.eql('2018-11-02');
    });
});

describe('isDateValid', () => {
    it('returns true when date is YYYY-MM-DD', () => {
        expect(util.isDateValid('2018-01-01')).to.be.true;
    });

    it('returns false when date is not YYYY-MM-DD', () => {
        expect(util.isDateValid('2018-01-O1')).to.be.false;
    });
});
