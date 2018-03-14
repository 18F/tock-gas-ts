import * as tock from './tock';
import * as timecardSheet from './timecard-sheet';

export function logExampleTimecardInfo() {
    const res = tock.getTimecards({
        date: '2018-03-05',
        user: 'atul.varma',
    });
    Logger.log(res[0]);
}

interface UpdateResult {
    date: string;
    rowsAdded: number;
    rowsRemoved: number;
}

function getFunctionName(func: Function): string {
    // TypeScript doesn't seem to define the 'name' property on
    // functions, perhaps because it's non-standard or something,
    // but it seems to exist in GAS and Node, so we'll trust that
    // it exists.
    const name: string = (func as any)['name'];

    if (!(name && typeof(name) === 'string')) {
        throw new Error(`${func} has no name`);
    }

    return name;
}

export function updateRowsForDate(date: string): UpdateResult|null {
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

    if (!timecardSheet.DATE_REGEX.test(date)) {
        Browser.msgBox(
            'Error',
            'Please enter a date in YYYY-MM-DD format!',
            Browser.Buttons.OK
        );
        return;
    }

    const result = updateRowsForDate(date);

    SpreadsheetApp.flush();

    let msg = '';

    if (result) {
        msg = (
            `Added ${result.rowsAdded} rows of timecard data ` +
            `from Tock for ${result.date}`
        );
        if (result.rowsRemoved) {
            msg += `, removing ${result.rowsRemoved} old rows.`;
        } else {
            msg += `.`;
        }
    } else {
        msg = `Tock doesn't have any timecard data for ${date}!`;
    }

    Browser.msgBox('Finished', msg, Browser.Buttons.OK);
}
