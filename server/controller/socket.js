const { getStructure, makeDir, makeFile, buildRelations } = require('./util.js');

exports.socketHandle = socket => {
    //建立项目目录结构
    socket.on('make-structure', structure => {
        if (structure && typeof structure === 'object') {
            structure.directory && structure.entry && makeDir(structure);
        }
    })
    //get folders
    socket.on('get-folders', () => {
        socket.emit('get-folders', getStructure());
    })
    //make folders
    socket.on('make-dir', folders => {
        makeDir(folders);
    })
    //new file
    socket.on('make-file', obj => {
        makeFile(obj);
    })
    //get modules name
    socket.on('get-module', () => {
        const package = require(`../../package.json`);
        const modulesName = [];
        for(var key in package.dependencies) {
            modulesName.push(key);
        }
        socket.emit('get-module', modulesName);
    })
    //battery之间建立引用关系
    socket.on('build-relation', relation => {
        buildRelations(relation);
    })
    //vsCode open file
    socket.on('edit-file', name => {
        shell.exec(`code ${__dirname}/app/${name}.js`);
    })
}