const path = require('path');
const fs = require('fs');
const client = require('socket.io')(3030);
const shell = require('shelljs');
const electron = require('electron');

// 用户的工作目录
const rootdir = process.cwd();

// 整理目录结构及关系并保存一次
const { readdir } = require('./controller/relations.js');
readdir(rootdir);
const { saveStructure } = require('./model/data.js');
saveStructure();

// socket
const { socketHandle } = require('./controller/socket.js');
client.on('connection', socketHandle);

//open client view
// const dirname = path.resolve(__dirname, '../');
// shell.cd(`${dirname}/build`);
// shell.exec(`${electron} .`, { async: true });
// shell.cd(`../`);
