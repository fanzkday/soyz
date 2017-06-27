const fs = require('fs');
const shell = require('shelljs');
const { getStructure, makeDir, makeFile, buildRelations } = require('./util.js');

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
                updatePosition(relations.relations, item);
            })
        } else {
            updatePosition(relations.relations, data);
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
function updatePosition(relation, item) {
    for (var key in relation) {
        const o = relation[key];
        for (var v in o) {
            const element = o[v];
            if (element.hasOwnProperty('id') && element.id === item.batteryId) {
                element.pos.x = item.currX;
                element.pos.y = item.currY;
            }
        }
    }
}
