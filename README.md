This is an attempt to make a simple TypeScript-based
[Google Apps Script (GAS)][GAS] project.

## Quick start

First, create the configuration module:

```
cp config.ts.sample config.ts
```

Now edit `config.ts` as needed.

The function exposed to the GAS runtime as `main` will be taken from
`main.ts`'s default export.

To create the final bundle for export to GAS, run:

```
npm run build
cat bundle.gs | pbcopy
```

Now paste your clipboard contents into a `.gs` file at
[script.google.com][].

[GAS]: https://developers.google.com/apps-script/
[script.google.com]: https://script.google.com/
