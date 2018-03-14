import * as tock from './tock';
import * as timecardSheet from './timecard-sheet';
import * as ui from './ui';

import { getFunctionName, isDateValid } from './util';

export function logExampleTimecardInfo() {
    const res = tock.getTimecards({
        date: '2018-03-05',
        user: 'atul.varma',
    });
    Logger.log(res[0]);
}

export function updateRowsForDate(date: string): ui.UpdateResult|null {
    const sheet = SpreadsheetApp.getActiveSheet();

    timecardSheet.validateSheetHeader(sheet);

    const cards = tock.getTimecards({ date })
      .filter(tc => tc.billable && tc.hours_spent > 0);

    if (cards.length === 0) {
        Logger.log(`No timecard rows matching ${date}.`);
        return null;
    }

    // The API may have adjusted the date to match the beginning of
    // a week, so we'll use that.
    date = cards[0].start_date;

    const lock = LockService.getDocumentLock();

    lock.waitLock(1000);

    try {
        let rowsRemoved = timecardSheet.removeRowsWithStartDate(sheet, date);
        Logger.log(`Adding ${cards.length} rows for ${date}.`);
        timecardSheet.addRows(sheet, cards);
        return { rowsAdded: cards.length, rowsRemoved, date };
    } finally {
        lock.releaseLock();
    }
}

// This is a special function that runs when the spreadsheet is open.
export function onOpen() {
    const spreadsheet = SpreadsheetApp.getActive();

    if (!spreadsheet) {
        Logger.log('Active spreadsheet is null, not adding menu.');
        return;
    }

    const menuItems = [
        {
            name: 'Create empty timecard sheet',
            functionName: getFunctionName(createEmptyTimecardSheet_),
        },
        {
            name: 'Update timecard sheet from Tock...',
            functionName: getFunctionName(updateFromTock_),
        },
    ];
    spreadsheet.addMenu('Tock', menuItems);
}

export function createEmptyTimecardSheet_() {
    var spreadsheet = SpreadsheetApp.getActive();

    if (!spreadsheet) {
        throw new Error('Unable to get active spreadsheet!');
    }

    timecardSheet.createSheet(spreadsheet);
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

    if (!isDateValid(date)) {
        Browser.msgBox(
            'Error',
            'Please enter a date in YYYY-MM-DD format!',
            Browser.Buttons.OK
        );
        return;
    }

    const result = updateRowsForDate(date);

    SpreadsheetApp.flush();

    Browser.msgBox('Finished', ui.msgForUpdateResult(date, result), Browser.Buttons.OK);
}
