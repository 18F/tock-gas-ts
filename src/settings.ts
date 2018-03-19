export const TOCK_API_URL = "https://tock.18f.gov/api";

type Setting = 'TOCK_API_KEY'|'PROJECT_PREFIX_FILTER';

export function isSettingRequired(name: Setting): boolean {
    switch (name) {
        case 'TOCK_API_KEY':
        return true;

        case 'PROJECT_PREFIX_FILTER':
        return false;
    }
}

export function getSetting(name: Setting): string {
    const spreadsheet = SpreadsheetApp.getActive();

    if (!spreadsheet) {
        throw new Error('Unable to get active spreadsheet!');
    }

    const range = spreadsheet.getRangeByName(name);
    if (range === null) {
        throw new Error(`Named range ${name} does not exist!`);
    }

    return range.getValue().toString().trim();
}
