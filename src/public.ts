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
    const cards = tock.getTimecards({ date })
      .filter(tc => tc.billable && tc.hours_spent > 0);

    if (cards.length === 0) {
        Logger.log(`No timecard rows matching ${date}.`);
        return;
    }

    // The API may have adjusted the date to match the beginning of
    // a week, so we'll use that.
    date = cards[0].start_date;

    const lock = LockService.getDocumentLock();

    lock.waitLock(1000);

    try {
        timecardSheet.removeRowsWithStartDate(sheet, date);
        Logger.log(`Adding ${cards.length} rows for ${date}.`);
        timecardSheet.addRows(sheet, cards);
    } finally {
        lock.releaseLock();
    }
}

// This is a special function that runs when the spreadsheet is open.
export function onOpen() {
    var spreadsheet = SpreadsheetApp.getActive();

    if (!spreadsheet) {
        Logger.log('Active spreadsheet is null, not adding menu.');
        return;
    }

    var menuItems = [
        { name: 'Update from Tock...', functionName: 'updateFromTock_' }
    ];
    spreadsheet.addMenu('Tock', menuItems);
}

export function updateFromTock_() {
    const date = Browser.inputBox(
        'Update from Tock',
        'Please enter the week you would like to update from Tock, in ' +
        'YYYY-MM-DD format.',
        Browser.Buttons.OK_CANCEL
    );

    if (date === 'cancel') {
        return;
    }

    if (!timecardSheet.DATE_REGEX.test(date)) {
        Browser.msgBox(
            'Error',
            'Please enter a date in YYYY-MM-DD format!',
            Browser.Buttons.OK
        );
        return;
    }

    updateRowsForDate(date);

    SpreadsheetApp.flush();
}
