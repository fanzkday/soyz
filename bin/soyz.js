#!/usr/bin/env node
const shell = require('shelljs');
const path = require('path');

const dirname = path.resolve(__dirname, '../');

const argv = process.argv.slice(2);
if (argv[0] === 'demo') {

    shell.rm('-rf', `${process.cwd()}/demo`);
    shell.cp('-Rf', `${dirname}/demo`, `${process.cwd()}/demo`);
    shell.cd(`${process.cwd()}/demo`);
    shell.exec(`soyz start`);

} else if (argv[0] === 'init') {

    shell.rm('-rf', `${process.cwd()}/.soyz`);
    shell.mkdir('-p', `${process.cwd()}/.soyz`);
    shell.cp('-Rf', `${dirname}/server/conf/config.json`, `${process.cwd()}/.soyz`);

} else if (argv[0] === 'start') {

    shell.exec(`node ${dirname}/server/app.js`);
    
} else {
    console.log(`
    A.如果想看看demo，请
      soyz demo
    B.如果有自己正式的项目，请
      soyz init
      /* 在项目的根目录下的.soyz文件夹下，根据项目需要修改config.json文件 */
      /* 修改完config.json,文件之后 */
      soyz start
  `);
}
