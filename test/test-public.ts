import { expect } from 'chai';

import { normalizeDateToString } from '../src/util';
import { tockDateRange } from '../src/public';

function str(dates: Date[]): string[] {
    return dates.map(normalizeDateToString);
}

describe('tockDateRange', () => {
    it('works when start and end are the same', () => {
        expect(str(tockDateRange('2018-01-14', '2018-01-14')))
          .to.eql(['2018-01-14']);
    });

    it('works when start and end are within the same week', () => {
        expect(str(tockDateRange('2018-01-15', '2018-01-20')))
          .to.eql(['2018-01-14']);
    });

    it('works when start and end are multiple weeks apart', () => {
        expect(str(tockDateRange('2018-01-14', '2018-01-28')))
          .to.eql(['2018-01-14', '2018-01-21', '2018-01-28']);
    });

    it('raises an error when the end date is past the start', () => {
        expect(() => {
            tockDateRange('2018-01-14', '2017-01-01');
        }).to.throw('Start date (2018-01-14) is after end (2017-01-01)');
    });
});
