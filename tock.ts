import { TOCK_API_KEY } from './config';

const TOCK_API_URL = "https://tock.18f.gov/api";

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

    const response = UrlFetchApp.fetch(`${TOCK_API_URL}/user_data.json`, {
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
