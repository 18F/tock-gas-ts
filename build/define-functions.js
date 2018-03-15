process.env['TS_NODE_SKIP_PROJECT'] = true;

require('ts-node/register');

const { readFileSync } = require('fs');
const path = require('path');
const ts = require('typescript');

function main() {
  const MOD_NAME = 'public';
  const MOD_PATH = path.join(__dirname, '..', 'src', `${MOD_NAME}.ts`);
  const MOD_CODE = readFileSync(MOD_PATH, 'utf-8');
  const MOD_FUNC_INFO = extractFunctionInfo(MOD_CODE);

  const publicFuncs = require(MOD_PATH);

  process.stdout.write(Object.keys(publicFuncs).map(name => {
      const mod = `require(${JSON.stringify(MOD_NAME)})`;
      const fn = `${mod}[${JSON.stringify(name)}]`;
      let funcInfo = MOD_FUNC_INFO[name];
      let args = '';
      let jsdocs = '';

      if (funcInfo) {
        args = funcInfo.args.join(', ');
        jsdocs = funcInfo.jsdocs;
      }

      return (
        jsdocs +
        `function ${name}(${args}) {\n` +
        `  return ${fn}.apply(this, arguments);\n` +
        `}\n`
      );
  }).join('\n'));
}

function extractFunctionInfo(code) {
  const FUNC_RE = /^export function ([A-Za-z0-9_]+)\(/;
  const funcs = {};
  let jsdocsSoFar = [];
  let inJsdocComment = false;

  code.split('\n').forEach(line => {
    const trimmed = line.trim();
    let funcName = null;

    if (inJsdocComment) {
      jsdocsSoFar.push(line);
      if (trimmed === '*/') {
        inJsdocComment = false;
      }
    } else {
      if (trimmed === '/**') {
        inJsdocComment = true;
        jsdocsSoFar.push(line);
      } else {
        let match = FUNC_RE.exec(line);

        if (match && jsdocsSoFar.length) {
          const name = match[1];
          funcs[name] = {
            name,
            args: extractFuncArgs(`${line} }`, name),
            jsdocs: jsdocsSoFar.join('\n') + '\n'
          };
        }

        jsdocsSoFar = [];
      }
    }
  });

  return funcs;
}

function extractFuncArgs(funcDecl, funcName = 'anonymous') {
  const sf = ts.createSourceFile(`func_${funcName}.ts`, funcDecl);
  return sf.statements[0].parameters.map(param => param.name.escapedText);
}

module.exports = {
  extractFunctionInfo,
  extractFuncArgs,
};

if (module.parent === null) {
  main();
}
