const http = require('http');

const io = require('socket.io');
const shell = require('shelljs');
const electron = require('electron');

const { selfPath } = require('./conf/path.json');

//const { watch } = require('./controller/util.js');
const { socketHandle } = require('./controller/socket.js');
const { getStructure, makeDir, makeFile } = require('./controller/util.js');
//start http server and socket
const server = http.createServer();

const client = io.listen(server);
client.on('connection', socket => {
  //get folders
  socket.on('get-folders', () => {
    socket.emit('get-folders', getStructure());
  })
  //make folders
  socket.on('make-dir', folders => {
    console.log(folders);
    makeDir(folders);
  })
  //new file
  socket.on('make-file', obj => {
    makeFile(obj);
  })
  //vsCode open file
  socket.on('edit-file', name => {
    shell.exec(`code ${__dirname}/app/${name}.js`);
  })
});

server.listen(3030, () => {
  console.log('http server running on 3030');
})
//listener all files
//watch(path, client);

//open client view
shell.exec(`${electron} ${selfPath}/web/index.html`, { async: true });

//全局错误处理
process.on('uncaughtException', err => {
  console.error(err);
  process.exit(1);
})