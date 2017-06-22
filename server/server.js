const http = require('http');

const client = require('socket.io')(3030);
const shell = require('shelljs');
const electron = require('electron');

// 整理目录结构及关系, 同步阻塞进行;
const { generateSt } = require('./controller/relations.js');
generateSt('app');

// socket
const { socketHandle } = require('./controller/socket.js');
client.on('connection', socketHandle);

//open client view
//shell.exec(`${electron} ../build/index.html`, { async: true });

//全局错误处理
process.on('uncaughtException', err => {
  console.error(err);
  process.exit(1);
})