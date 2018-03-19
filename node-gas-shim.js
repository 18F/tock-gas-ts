process.env['TS_NODE_SKIP_PROJECT'] = true;

require('ts-node/register');

const request = require('sync-request');

const { isSettingRequired } = require('./src/settings.ts');

// Define the GAS global APIs we use here.

// https://developers.google.com/apps-script/reference/url-fetch/http-response
class HttpResponse {
    constructor(text) {
        this._text = text;
    }

    getContentText() {
        return this._text;
    }
}

// https://developers.google.com/apps-script/reference/url-fetch/url-fetch-app
global.UrlFetchApp = {
    fetch(url, params) {
        const res = request('GET', url, {
            headers: (params && params.headers) || {},
        });
        return new HttpResponse(res.getBody());
    }
};

// https://developers.google.com/apps-script/reference/base/logger
global.Logger = {
    log(msg) {
        console.log(msg);
    }
};

// https://developers.google.com/apps-script/reference/spreadsheet/range
class Range {
    constructor(value) {
        this.value = value;
    }

    getValue() {
        return this.value;
    }
}

// https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet
class Spreadsheet {
    getRangeByName(name) {
        if (/^[A-Z0-9_]+$/.test(name)) {
            if (name in process.env) {
                return new Range(process.env[name]);
            } else {
                if (isSettingRequired(name)) {
                    throw new Error(`Please define ${name} in your environment`);
                }
                return new Range('');
            }
        } else {
            return null;
        }
    }
}

// https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet-app
global.SpreadsheetApp = {
    getActive: function() {
        return new Spreadsheet();
    }
};

// Now run the exported GAS function.

if (module.parent === null) {
    const MOD_PATH = './src/public.ts';
    const path = require('path');
    const public = require(MOD_PATH);
    let funcName = process.argv[2];

    if (!funcName) {
        const cmd = path.basename(process.argv[1]);
        const funcNames = Object.keys(public).filter(name => {
            return typeof(public[name]) === 'function';
        });

        if (funcNames.length === 0) {
            console.log(`Please export functions in ${MOD_PATH}!`);
            process.exit(1);
        } else if (funcNames.length === 1) {
            funcName = funcNames[0];
        } else {
            const funcs = funcNames.join('|');
            console.log(`usage: ${cmd} <${funcs}>`);
            process.exit(1);
        }
    }

    const func = public[funcName];

    if (typeof(func) !== 'function') {
        console.log(`${funcName} is not a function in ${MOD_PATH}!`);
        process.exit(1);
    }

    func();
}
