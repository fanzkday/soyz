#!/usr/bin/env node 
const shell = require('shelljs');
const path = require('path');

const dirname = path.resolve(__dirname, '../');

const argv = process.argv.slice(2);
if (argv[0] === 'demo') {
  shell.cp('-Rf', `${dirname}/demo`, `${process.cwd()}/demo`);
}else if (argv[0] === 'start') {
  shell.exec(`node ${dirname}/server/app.js`);
}
