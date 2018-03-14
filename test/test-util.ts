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

describe('isDateValid', () => {
    it('returns true when date is YYYY-MM-DD', () => {
        expect(util.isDateValid('2018-01-01')).to.be.true;
    });

    it('returns false when date is not YYYY-MM-DD', () => {
        expect(util.isDateValid('2018-01-O1')).to.be.false;
    });
});
