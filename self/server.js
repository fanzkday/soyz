const http = require('http');

const io = require('socket.io');
const shell = require('shelljs');

const { watch, getStructure } = require('./utils/util.js');

const path = './app';

const server = http.createServer();

const client = io.listen(server);

client.on('connection', socket => {
  //get structure
  getStructure(path);
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

process.on('uncaughtException', err => {
  console.error(err);
  process.exit(1);
})