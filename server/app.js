const path = require('path');
const fs = require('fs');

const client = require('socket.io')(3030);
const shell = require('shelljs');
const electron = require('electron');

// 整理目录结构及关系, 同步阻塞进行;

const dirname = path.resolve(__dirname, '../');

const rootdir = process.cwd();
const isExist = fs.existsSync(`${rootdir}/.soyz`);
if (!isExist) {
    fs.mkdirSync(`${rootdir}/.soyz`);
    shell.cp('-Rf', `${dirname}/server/conf/config.json`, `${process.cwd()}/.soyz/`);
}
const { readdir } = require('./controller/relations.js');
readdir(rootdir);
const { saveStructure } = require('./model/data.js');
saveStructure();

// socket
const { socketHandle } = require('./controller/socket.js');
client.on('connection', socketHandle);

//open client view
shell.cd(`${dirname}/build`);
shell.exec(`${electron} ./index.html`, { async: true });
shell.cd(`../`);