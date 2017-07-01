const fs = require('fs');
const Path = require('path');
const shell = require('shelljs');
const { getStructure, makeDir, makeFile, buildRelations } = require('./util.js');
const relations = require('../conf/relations.json');

const autoSaveInterval = require('../conf/config.json').autoSaveInterval;

const msgdir =  Path.resolve(__dirname, '../') + '/conf/relations.json';
exports.socketHandle = socket => {
    //自动保存
    const timer = setInterval(() => {
        fs.writeFileSync(msgdir, JSON.stringify(relations, null, 4));
    }, autoSaveInterval);

    socket.on('close', () => {
        clearInterval(timer);
    })
    //服务器推送数据
    socket.on('init', () => {
        socket.emit('init', relations);
    })
    //修改bat的pos坐标
    socket.on('position', data => {
        console.log(data);
        if (Array.isArray(data)) {
            data.forEach(item => {
                updatePosition(relations.relations, item);
            })
            fs.writeFileSync(msgdir, JSON.stringify(relations, null, 4));
        } else {
            updatePosition(relations.relations, data);
        }
        console.log(relations.relations);
    })

    //get folders
    socket.on('get-folders', () => {
        socket.emit('get-folders', getStructure());
    })
    //make folders
    socket.on('make-dir', folders => {
        makeDir(folders);
    })
    //battery之间建立引用关系
    socket.on('build-relation', relation => {
        buildRelations(relation);
    })
    //vsCode open file
    socket.on('edit-file', name => {
        shell.exec(`code ${process.cwd()}/${name}`);
    })
}

//遍历object， 修改数据
function updatePosition(relation, item) {
    for (var key in relation) {
        const element = relation[key];
        if (typeof element === 'object' && element.id === item.batteryId) {
            element.pos.x = item.currX;
            element.pos.y = item.currY;
        }
    }
}
