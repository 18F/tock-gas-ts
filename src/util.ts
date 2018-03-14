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

export function isDateValid(date: string): boolean {
    return DATE_REGEX.test(date);
}
