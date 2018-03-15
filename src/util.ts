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

const DATE_REGEX = /^\d\d\d\d-\d\d-\d\d$/;

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
        const mm = pad(date.getMonth(), 2);
        const dd = pad(date.getDate(), 2);
        return `${yyyy}-${mm}-${dd}`;
    }

    return date;
}
