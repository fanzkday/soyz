const http = require('http');

const client = require('socket.io')(3030);
const shell = require('shelljs');
const electron = require('electron');

const { socketHandle } = require('./controller/socket.js');

client.on('connection', socketHandle);

//listener all files
//const { watch } = require('./controller/util.js');
//watch(path, client);

//open client view
//shell.exec(`${electron} ../build/index.html`, { async: true });

//全局错误处理
process.on('uncaughtException', err => {
  console.error(err);
  process.exit(1);
})