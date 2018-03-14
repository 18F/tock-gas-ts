export interface UpdateResult {
    date: string;
    rowsAdded: number;
    rowsRemoved: number;
}

export function msgForUpdateResult(inputDate: string, result: UpdateResult|null) {
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
        msg = `Tock doesn't have any timecard data for ${inputDate}!`;
    }

    return msg;
}
