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
