import { expect } from 'chai';

import { valueForColumn } from '../src/timecard-sheet';
import { Timecard } from '../src/tock';

describe("valueForColumn", () => {
    it("works with amount_billed", () => {
        expect(valueForColumn({} as any as Timecard, 'amount_billed', 5))
          .to.eql('=D5 * IF(E5="", VLOOKUP(-1, GradeRates, 2), VLOOKUP(E5, GradeRates, 2))');
    });
});
