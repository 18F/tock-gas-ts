This is an attempt to make a simple TypeScript-based
[Google Apps Script (GAS)][GAS] project for interacting
with [Tock][] data.

## Quick start

### Setup

First, install dependencies:

```
npm install
```

Then create the configuration module:

```
cp config.ts.sample config.ts
```

Now edit `config.ts` as needed.

### Running in GAS

The function exposed to the GAS runtime as `main` will be taken from
`main.ts`'s default export.

To create the final bundle for export to GAS, run:

```
npm run build
cat bundle.gs | pbcopy
```

Now paste your clipboard contents into a `.gs` file at
[script.google.com][]. (Note that while deployment is supported
through the command-line by tools like `clasp`, we can't use
them because we don't have API access to Google Apps.)

### Running in Node

To run the `main` function in a Node shim that emulates the GAS
runtime, run:

```
node node-gas-shim.js
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
