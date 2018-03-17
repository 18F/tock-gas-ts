import { Timecard } from './tock';
import { normalizeDateToString } from './util';

type Sheet = GoogleAppsScript.Spreadsheet.Sheet;
type Spreadsheet = GoogleAppsScript.Spreadsheet.Spreadsheet;

type DataColumn = 'user'|'hours_spent'|'start_date'|'project_name'|'grade';
type FormulaColumn = 'amount_billed';
type Column = DataColumn|FormulaColumn;

const COLUMN_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const COLUMNS: Column[] = [
    'start_date',
    'user',
    'project_name',
    'hours_spent',
    'grade',
    'amount_billed',
];

const COLUMN_WIDTHS: {[K in Column]: number} = {
    'start_date': 100,
    'user': 200,
    'project_name': 400,
    'hours_spent': 100,
    'grade': 100,
    'amount_billed': 100,
};

function getColumnLetter(column: Column): string {
    const index = COLUMNS.indexOf(column);
    if (index === -1) {
        throw new Error(`Column ${column} does not exist!`);
    }

    if (index >= COLUMN_LETTERS.length) {
        throw new Error(`Column ${column} does not have a letter!`);
    }

    return COLUMN_LETTERS[index];
}

function getColumnNumber(column: Column): number {
    const index = COLUMNS.indexOf(column);
    if (index === -1) {
        throw new Error(`Column ${column} does not exist!`);
    }

    // Spreadsheet columns start at 1, not zero.
    return index + 1;
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

function valueForColumn(card: Timecard, column: Column, row: number): any {
    switch (column) {
        case 'amount_billed':
        const hours_spent = `${getColumnLetter('hours_spent')}${row}`;
        const grade = `${getColumnLetter('grade')}${row}`;
        return `=${hours_spent} * VLOOKUP(${grade}, GradeRates, 2)`;

        default:
        return card[column];
    }
}

export function addRows(sheet: Sheet, cards: Timecard[]) {
    // This is much faster than using .appendRow() for all the rows.
    // However, it should be wrapped in the Lock Service API to
    // ensure that weird collisions don't occur.
    //
    // For more details, see: https://stackoverflow.com/a/44695699
    const lastRow = sheet.getLastRow();
    sheet.insertRowsAfter(lastRow, cards.length);

    const values = cards.map((card, i) => COLUMNS.map(column => {
        const value = valueForColumn(card, column, lastRow + i + 1);

        // setValues() doesn't let us pass in `null` as a value, so
        // we'll convert such values to the empty string. Which is
        // weird, but whatever.
        return value === null ? '' : value
    }));
    sheet.getRange(lastRow + 1, 1, cards.length, COLUMNS.length)
      .setValues(values)
      .setFontWeight('normal');
}

export function removeRowsWithStartDate(sheet: Sheet, date: Date|string): number {
    date = normalizeDateToString(date);

    const col = getColumnNumber('start_date');

    sheet.sort(col);

    const numRows = sheet.getLastRow();
    const range = sheet.getRange(2, col, numRows);
    const values = range.getValues();
    let startRow: number|null = null;
    let rowsToDelete = 0;

    for (let i = 0; i < values.length; i++) {
        const rowDate = normalizeDateToString(values[i][0]);

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
