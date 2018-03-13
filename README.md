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
[script.google.com][].

### Running in Node

To run the `main` function in a Node shim that emulates the GAS
runtime, run:

```
node node-gas-shim.js
```

## Other resources

* [18F/Ops-GAS-Public](https://github.com/18F/Ops-GAS-Public) is an
  archived repository containing various Google Apps Scripts used
  for 18F operations.

[Tock]: https://github.com/18F/tock
[GAS]: https://developers.google.com/apps-script/
[script.google.com]: https://script.google.com/
