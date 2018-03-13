process.env['TS_NODE_SKIP_PROJECT'] = true;

require('ts-node/register');

const request = require('sync-request');

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

// Now run the main exported GAS function.

require('./main.ts')['default']();
