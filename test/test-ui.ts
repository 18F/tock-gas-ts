import { expect } from 'chai';

import * as ui from '../src/ui';

describe('msgForUpdateResult', () => {
    it('reports when Tock has no timecard data', () => {
        expect(ui.msgForUpdateResult('blah', null))
          .to.eql('Tock doesn\'t have any timecard data for blah!');
    });

    it('reports success when no rows are removed', () => {
        expect(ui.msgForUpdateResult('blah', { rowsAdded: 2, rowsRemoved: 0, date: 'bop' }))
          .to.eql('Added 2 rows of timecard data from Tock for bop.');
    });

    it('reports success when some rows are removed', () => {
        expect(ui.msgForUpdateResult('blah', { rowsAdded: 3, rowsRemoved: 2, date: 'merg' }))
          .to.eql('Added 3 rows of timecard data from Tock for merg, removing 2 old rows.');
    });
});
