const http = require('http');

const io = require('socket.io');
const shell = require('shelljs');
const electron = require('electron');

const { watch, getStructure, makeDir, makeFile } = require('./utils/util.js');

//project directory
const path = './app';
//get structure
//getStructure(path);

//start http server
const server = http.createServer();

const client = io.listen(server);

client.on('connection', socket => {
  //new folders
  socket.on('make-dir', folders => {
    makeDir(folders);
  })
  //new file
  socket.on('make-file', obj => {
    makeFile(obj);
  })
  //vsCode open file
  socket.on('openFile', path => {
    shell.exec(`code ${__dirname}/app/${path}.js`);
  })
})

server.listen(3030, () => {
  console.log('http server running on 3030');
})
//listener all files
watch(path, client);
//open client view
//shell.exec(`${electron} ./self/index.html`);

process.on('uncaughtException', err => {
  console.error(err);
  process.exit(1);
})