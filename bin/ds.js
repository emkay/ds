#!/usr/bin/env node

const reqmain = require.main;
require = require('esm')(module, { //eslint-disable-line
  force: true,
  wasm: true,
  cjs: {
    interop: true,
    namedExports: true,
    extensions: true,
    vars: true
  }
});

require('../lib/node/index.js');

const CMDS = new Set(['shell']);

const ALIASES = new Map([['prep', 'prepare'], ['sh', 'shell']]);

function runCommandWithYargs(argv) {
  let config = require('yargs')
    .demandCommand(1, 'Subcommand is required')
    .recommendCommands()
    .help()
    .alias('help', 'h')
    .alias('version', 'v')
    .completion();
  if (ALIASES.has(argv[2])) {
    config = config.command(
      require(`../lib/yargs-modules/${ALIASES.get(argv[2])}.js`)
    );
  } else if (CMDS.has(argv[2])) {
    config = config.command(require(`../lib/yargs-modules/${argv[2]}.js`));
  } else {
    for (const mod of CMDS.values()) {
      config = config.command(require(`../lib/yargs-modules/${mod}.js`));
    }
  }
  config = config.argv;
}

function main(argv) {
  return runCommandWithYargs(argv);
}
module.exports = main;

if (reqmain === module) {
  main(process.argv);
}
