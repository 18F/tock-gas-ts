export function getFunctionName(func: Function): string {
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

const DATE_REGEX = /^(\d\d\d\d)-(\d\d)-(\d\d)$/;

export function isDateStringValid(date: string): boolean {
    return DATE_REGEX.test(date);
}

// https://stackoverflow.com/a/10073788
function pad(n: string|number, width: number, z: string = '0') {
    n = n.toString();
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

export function normalizeDateToString(date: any): string {
    if (typeof date === 'string') {
        return date.trim();
    }

    if (date instanceof Date) {
        const yyyy = date.getFullYear();
        // The month is 0-indexed...
        const mm = pad(date.getMonth() + 1, 2);
        // But the date is not.
        const dd = pad(date.getDate(), 2);
        return `${yyyy}-${mm}-${dd}`;
    }

    return date;
}

export function stringToDate(str: string): Date {
    str = normalizeDateToString(str);

    const match = str.match(DATE_REGEX);

    if (!match) {
        throw new Error(`Invalid date: ${str} (expected YYYY-MM-DD format)`);
    }

    const year = parseInt(match[1]);

    // The month needs to be 0-indexed...
    const month = parseInt(match[2]) - 1;

    // But the date does not.
    const date = parseInt(match[3]);

    return new Date(year, month, date);
}

export function toDate(date: string|Date): Date {
    if (typeof date === 'string') {
        return stringToDate(date);
    }

    return date;
}

export function copyDate(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

export function getClosestTockStartDate(date: Date): Date {
    const SUNDAY = 0;

    let result = copyDate(date);

    while (result.getDay() !== SUNDAY) {
        result.setTime(result.getTime() - ONE_DAY_IN_MS);
    }

    return result;
}

export type CellType = string|Date|number|boolean;

export function toCellTypeArray(values: any, result: CellType[] = []): CellType[] {
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
