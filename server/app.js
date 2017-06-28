const http = require('http');
const path = require('path');

const client = require('socket.io')(3030);
const shell = require('shelljs');
const electron = require('electron');

// 整理目录结构及关系, 同步阻塞进行;
const { generateSt } = require('./controller/relations.js');
generateSt();

// socket
const { socketHandle } = require('./controller/socket.js');
client.on('connection', socketHandle);

const dirname = path.resolve(__dirname, '../');
//open client view
shell.cd(`${dirname}/build`);
shell.exec(`${electron} ./index.html`, { async: true });

//全局错误处理
process.on('uncaughtException', err => {
  console.error(err);
  process.exit(1);
})