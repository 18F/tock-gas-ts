import { getSetting, TOCK_API_URL } from './settings';

export interface QueryArgs {
    [key: string]: string;
}

function queryArgsToString(queryArgs: QueryArgs): string {
    return Object.keys(queryArgs).map((key: string): string => {
        const value = encodeURIComponent(queryArgs[key]);
        return `${key}=${value}`;
    }).join('&');
}

export function getJSON(path: string, queryArgs?: QueryArgs): any {
    let url = `${TOCK_API_URL}${path}`;

    if (queryArgs) {
        url += `?${queryArgsToString(queryArgs)}`;
    }

    const TOCK_API_KEY = getSetting('TOCK_API_KEY');

    const response = UrlFetchApp.fetch(url, {
        headers: {
            'Authorization': `Token ${TOCK_API_KEY}`
        }
    });
    return JSON.parse(response.getContentText());
}

export interface UserData {
    user: string;
    current_employee: boolean;
    is_18f_employee: boolean;
    is_billable: boolean;
    unit: string|null;
    organization: null;
}

// https://github.com/18F/tock/blob/master/api-docs/user-data.md
export function getUserData(): UserData[] {
    return getJSON('/user_data.json');
}

export interface Timecard {
    user: string;
    project_id: string;
    project_name: string;
    profit_loss_account: string;
    hours_spent: number;
    start_date: string;
    end_date: string;
    billable: boolean;
    agency: string;
    flat_rate: boolean;
    notes: string;
    revenue_profit_loss_account: string|null;
    revenue_profit_loss_account_name: string|null;
    expense_profit_loss_account: null;
    expense_profit_loss_account_name: null;
    employee_organization: string;
    project_organization: string;
    grade: number|null;
}

// https://github.com/18F/tock/blob/master/api-docs/timecards.md
export function getTimecards(options?: {
    date?: string;
    user?: string;
    project?: string;
}): Timecard[] {
    return getJSON('/timecards.json', options as QueryArgs)
      .map((timecard: any) => ({
        ...timecard,
        // For some reason the API returns a string for this,
        // so we'll parse it into a float.
        hours_spent: parseFloat(timecard.hours_spent),
      }));
}
