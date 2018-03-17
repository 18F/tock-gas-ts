import * as tock from './tock';
import * as timecardSheet from './timecard-sheet';
import * as ui from './ui';

import { PROJECT_PREFIX } from './config';
import {
    getFunctionName,
    isDateStringValid,
    toDate,
    getClosestTockStartDate,
    copyDate,
    ONE_DAY_IN_MS,
    normalizeDateToString
} from './util';

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
      .filter(tc => tc.project_name.indexOf(PROJECT_PREFIX) === 0)
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

    if (!isDateStringValid(date)) {
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

/**
 * Return the range of Tock dates (Sundays) between two dates.
 *
 * @param {DATE(2018, 1, 14)} start The start date. If this date is not on
 *   a Sunday, the first Sunday prior to this date is used.
 * @param {"2018-03-25"} end The end date. If this date is not on a Sunday,
 *   the first Sunday prior to this date is used.
 *
 * @return The range of dates between the start and end.
 * @customfunction
 */
export function tockDateRange(start: string|Date, end: string|Date): Date[] {
    const dates: Date[] = [];

    start = getClosestTockStartDate(toDate(start));
    end = getClosestTockStartDate(toDate(end));

    if (start.getTime() > end.getTime()) {
        throw new Error(`Start date (${normalizeDateToString(start)}) ` +
                        `is after end (${normalizeDateToString(end)})`);
    }

    const curr = copyDate(start);

    while (curr.getTime() < end.getTime()) {
        dates.push(copyDate(curr));
        curr.setTime(curr.getTime() + ONE_DAY_IN_MS * 7);
    }

    dates.push(copyDate(end));

    return dates;
}

type CellType = string|Date|number|boolean;

function toCellTypeArray(values: any, result: CellType[] = []): CellType[] {
    if (Array.isArray(values)) {
        values.forEach(value => toCellTypeArray(value, result));
    } else {
        if (typeof values === 'string' ||
            typeof values === 'number' ||
            typeof values === 'boolean' ||
            values instanceof Date)
        {
            result.push(values);
        } else {
            throw new Error(`Unexpected cell type: ${values} (${typeof values})`);
        }
    }

    return result;
}

/**
 * Return a comma-separated list of values that are in the
 * second list, but not in the first.
 *
 * @param {Range} values A list of values.
 * @param {Range} allValues A list of values that is expected
 *   to be a superset of the first list of values.
 *
 * @return A comma-separated list of values in the second list
 *   that are not in the first list.
 * @customfunction
 */
export function listDifferences(values: any, allValues: any): string {
    function toStr(value: CellType) {
        return value instanceof Date ? normalizeDateToString(value) : value.toString();
    }

    const set = toCellTypeArray(values).map(toStr);
    const superset = toCellTypeArray(allValues).map(toStr);
    return superset.filter(value => set.indexOf(value) === -1).join(', ');
}
