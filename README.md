This is an attempt to make a simple TypeScript-based
[Google Apps Script (GAS)][GAS] project for interacting
with [Tock][] data.

## Quick start

### Setup

First, install dependencies:

```
npm install
```

### Configuring settings

The `src/settings.ts` file contains settings that are
dynamically pulled from a different place, depending on the
context the script is run in:

* If the script is run in Node, then the setting is
  expected to exist in the environment.

* If the script is run in GAS (i.e., from an actual
  Google Spreadsheet), then the setting is expected to
  exist in a cell that is identified by a [named range][]
  with the name of the setting. For example, if the setting
  is called `FOO`, then there should be a
  named range in the spreadsheet called `FOO`, and
  its upper-left cell should contain the setting's value.

Here are the settings that can be configured:

* `TOCK_API_KEY` is the Tock API key that will be used when
  authenticating requests to Tock.

* `PROJECT_PREFIX_FILTER` is an optional string. Set it to
  automatically filter out any timecard entries whose project
  name doesn't start with the value you provide. For
  example, setting it to `Custom Partner Solutions` will
  ensure that only timecard data pertaining to CPS-related
  projects is returned.

[named range]: https://support.google.com/docs/answer/63175

### Running in GAS

Any functions exported in `src/public.ts` will be exposed to the
GAS runtime as top-level functions.

To create the final bundle for export to GAS on OS X, run:

```
npm run osx-clipboard
```

(If you're on windows, use `npm run win32-clipboard` instead.)

Now paste your clipboard contents into a `.gs` file at
[script.google.com][].

Note that while deployment is supported through the command-line
by tools like `clasp`, we can't use them because we don't have
API access to Google Apps. So we have to use the clipboard
for now.

### Running in Node

To run any public function in a Node shim that emulates the GAS
runtime, run:

```
node node-gas-shim.js
```

Note that only a few parts of the GAS runtime are currently
emulated, so this probably won't work for all public functions.

### Running tests

The test suite can be run via:

```
npm test
```

## Other resources

* [18F/Ops-GAS-Public](https://github.com/18F/Ops-GAS-Public) is an
  archived repository containing various Google Apps Scripts used
  for 18F operations. It is no longer used, because it took too
  long to run, triggering Google Apps Script's quota or and/or
  timeout limits.

* [clasp](https://github.com/google/clasp) is a Google-built
  toolchain that allows Google Apps Scripts to be developed and
  deployed locally. However, it seems to require API access to
  Google Apps, which we don't have at GSA.

[Tock]: https://github.com/18F/tock
[GAS]: https://developers.google.com/apps-script/
[script.google.com]: https://script.google.com/
