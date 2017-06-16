const { getStructure, makeDir, makeFile } = require('./util.js');

exports.socketHandle = socket => {
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
}