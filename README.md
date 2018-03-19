This repository contains code and example spreadsheets
to facilitate the integration of [Tock][] data with
Google Spreadsheets via [Google Apps Script (GAS)][GAS].

Here's a screenshot of the burn document example
spreadsheet (all data is fake):

![Burn document example screenshot](https://user-images.githubusercontent.com/124687/37600915-0dc46950-2b5f-11e8-9b46-428d6298b013.png)

## Quick start

If you work for the GSA, this is easy

1. Make a copy of the
   [Tock Burn Document Example Template][example].

2. In your copy, visit the "Settings" sheet and make
   any necessary changes.

3. Visit the "Timecards" sheet and delete all but the
   first row.

4. Find the "Tock" pull-down menu and choose
   "Update timecard sheet from Tock...", entering a
   date when it prompts you.

5. Visit the "Burn Sheet" sheet. Change the
   project field to the *exact* name of the project
   you want to create a burn document for, as it's
   reported in Tock. Then change its budget and
   average hourly rate, as well as its dates
   and participants. Follow the instructions
   on the sheet for adding weeks and/or participants
   as needed. Also take a look at the "Sanity checks"
   section to make sure you're not forgetting anything.

You can add multiple burn sheets for different projects
by copying the "Burn sheet" sheet and repeating step 5.

Make sure you regularly visit the "Timecards" sheet and
repeat step 4 to ensure that your Tock data stays
up-to-date!

[example]: https://docs.google.com/spreadsheets/d/14GnoVKA0O7tiOsfLp_v3UJDj6fuRfxWrx2zfku4ewwI/edit?usp=sharing

## Not-so-quick start

If you don't have access to the GSA's Google Apps
account, or if for some reason the example template
is no longer accessible, it's ok!  But it'll take more
work.

1. First, you'll want to go through the
   development instructions below, at least through the
   "Running in GAS" section. Make sure you now have the JS
   bundle in your clipboard.

2. You can import the Excel spreadsheet at
   `examples/Tock Burn Document Example Template.xlsx`
   to Google Sheets. Then you'll need to find the
   "Tools" pull-down menu, choose "Script editor",
   and paste in the script from your clipboard.
   Then save the code, go back to the
   spreadsheet, and reload the page in your browser.

At this point you can follow the quick start instructions,
starting at step 2.

## Development instructions

This section contains details on developing the
code in this repository, as well as information on
how to bundle it for deployment.

### Setup

First, install dependencies:

```
npm install
```

### Configuring settings

**Note:** If you're using one of the example spreadsheets, don't
worry about this section--everything it covers will
be explained in the "Settings" sheet of the example
spreadsheet you're using.

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
