const http = require('http');
const io = require('socket.io');
const fs = require('fs');
const shell = require('shelljs');

const server = http.createServer();

const client = io.listen(server);

client.on('connection', socket => {

  //vsCode open file
  socket.on('openFile', path => {
    shell.exec(`code ${__dirname}/app/${path}.js`);
  })
})

server.listen(3030, () => {
  console.log('http server running on 3030');
})
fs.watch('./app', (type, filename) => {
  console.log(type, filename);
})
