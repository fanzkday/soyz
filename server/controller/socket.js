const fs = require('fs');
const shell = require('shelljs');
const { getStructure, makeDir, makeFile, buildRelations } = require('./util.js');
const { getDevDependencies } = require('./tools.js');


exports.socketHandle = socket => {
    const relations = require('../conf/relations.json');
    //自动保存
    const timer = setInterval(() => {
        fs.writeFileSync('./server/conf/relations.json', JSON.stringify(relations, null, 4));
    }, 150000);
    socket.on('close', () => {
        clearInterval(timer);
    })
    //服务器推送数据
    socket.on('init', () => {
        socket.emit('init', relations);
    })
    //修改bat的pos坐标
    socket.on('position', data => {
        if (Array.isArray(data)) {
            data.forEach(item => {
                reObject(relations.relations, item);
            })
        } else {
            reObject(relations.relations, data);
        }
    })

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
        socket.emit('get-module', getDevDependencies());
    })
    //battery之间建立引用关系
    socket.on('build-relation', relation => {
        buildRelations(relation);
    })
    //vsCode open file
    socket.on('edit-file', name => {
        shell.exec(`code ${process.cwd()}${name}`);
    })
}

//遍历object， 修改数据
function reObject(targetObj, option) {
    for (var key in targetObj) {
        const o = targetObj[key];
        if (typeof o === 'object' && !o.hasOwnProperty('id')) {
            reObject(o, option);
        }
        if (typeof o === 'object' && o.hasOwnProperty('id') && o.id == option.batteryId) {
            o.pos.x = option.currX;
            o.pos.y = option.currY;
        }
    }
}
