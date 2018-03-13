process.env['TS_NODE_SKIP_PROJECT'] = true;

require('ts-node/register');

const MOD_NAME = 'public';
const publicFuncs = require(`../src/${MOD_NAME}.ts`);

process.stdout.write(Object.keys(publicFuncs).map(name => {
    const mod = `require(${JSON.stringify(MOD_NAME)})`;
    const fn = `${mod}[${JSON.stringify(name)}]`;
    return (
      `function ${name}() {\n` +
      `  return ${fn}.apply(this, arguments);\n` +
      `}\n`
    );
}).join('\n'));
