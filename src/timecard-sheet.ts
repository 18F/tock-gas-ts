import { Timecard } from './tock';

type Sheet = GoogleAppsScript.Spreadsheet.Sheet;
type Spreadsheet = GoogleAppsScript.Spreadsheet.Spreadsheet;

type Column = 'user'|'hours_spent'|'start_date'|'project_name';

const COLUMNS: Column[] = [
    'start_date',
    'user',
    'project_name',
    'hours_spent'
];

const COLUMN_WIDTHS: {[K in Column]: number} = {
    'start_date': 100,
    'user': 200,
    'project_name': 400,
    'hours_spent': 100,
};

export const DATE_REGEX = /^\d\d\d\d-\d\d-\d\d$/;

function getColumnNumber(column: Column): number {
    const index = COLUMNS.indexOf(column);
    if (index === -1) {
        throw new Error(`Column ${column} does not exist!`);
    }

    // Spreadsheet columns start at 1, not zero.
    return index + 1;
}

function normalizeDate(date: any): string {
    if (typeof date === 'string') {
        return date.trim();
    }

    if (date instanceof Date) {
        return Utilities.formatDate(date, 'GMT', 'yyyy-MM-dd');
    }

    return date;
}

export function createSheet(spreadsheet: Spreadsheet): Sheet {
    const sheet = spreadsheet.insertSheet();

    sheet.appendRow(COLUMNS);

    sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight('bold');

    COLUMNS.forEach(name => {
        sheet.setColumnWidth(getColumnNumber(name), COLUMN_WIDTHS[name]);
    });

    sheet.setFrozenRows(1);

    return sheet;
}

export function validateSheetHeader(sheet: Sheet) {
    const lastRow = sheet.getLastRow();

    if (lastRow < 1) {
        throw new Error('Sheet contains no rows!');
    }

    const firstRow = sheet.getRange(1, 1, 1, COLUMNS.length).getValues()[0];
    COLUMNS.forEach((name, i) => {
        if (firstRow[i] !== name) {
            throw new Error(`Expected column ${i + 1} header to be ` +
                            ` ${name} but it is ${firstRow[i]}`);
        }
    });
}

export function addRows(sheet: Sheet, cards: Timecard[]) {
    // This is much faster than using .appendRow() for all the rows.
    // However, it should be wrapped in the Lock Service API to
    // ensure that weird collisions don't occur.
    //
    // For more details, see: https://stackoverflow.com/a/44695699
    const lastRow = sheet.getLastRow();
    sheet.insertRowsAfter(lastRow, cards.length);

    const values = cards.map(card => COLUMNS.map(column => card[column]));
    sheet.getRange(lastRow + 1, 1, cards.length, COLUMNS.length)
      .setValues(values)
      .setFontWeight('normal');
}

export function removeRowsWithStartDate(sheet: Sheet, date: Date|string): number {
    date = normalizeDate(date);

    const col = getColumnNumber('start_date');

    sheet.sort(col);

    const numRows = sheet.getLastRow();
    const range = sheet.getRange(2, col, numRows);
    const values = range.getValues();
    let startRow: number|null = null;
    let rowsToDelete = 0;

    for (let i = 0; i < values.length; i++) {
        const rowDate = normalizeDate(values[i][0]);

        if (rowDate === date) {
            if (startRow === null) {
                // Rows start at 1, and the first is the header row.
                startRow = i + 2;
            }
            rowsToDelete += 1;
        } else if (startRow !== null) {
            break;
        }
    }

    if (startRow !== null) {
        Logger.log(`Deleting ${rowsToDelete} row(s) starting at ${startRow}.`);
        sheet.deleteRows(startRow, rowsToDelete);
    }

    return rowsToDelete;
}
