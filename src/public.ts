import * as tock from './tock';
import * as timecardSheet from './timecard-sheet';

export function logExampleTimecardInfo() {
    const res = tock.getTimecards({
        date: '2018-03-05',
        user: 'atul.varma',
    });
    Logger.log(res[0]);
}

export function updateRowsForDate(date = '2018-03-05') {
    const sheet = SpreadsheetApp.getActiveSheet();
    const cards = tock.getTimecards({ date }).filter(tc => tc.billable);

    if (cards.length === 0) {
        Logger.log(`No timecard rows matching ${date}.`);
        return;
    }

    // The API may have adjusted the date to match the beginning of
    // a week, so we'll use that.
    date = cards[0].start_date;

    timecardSheet.removeRowsWithStartDate(sheet, date);
    Logger.log(`Adding ${cards.length} rows for ${date}.`);
    timecardSheet.addRows(sheet, cards);
}
