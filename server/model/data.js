const fs = require('fs');
const Path = require('path');

const { getDependencies } = require('../controller/tools.js');

const rootdir = process.cwd();

var structure;

const config = require(`${rootdir}/.soyz/config.json`);

const msgdir = `${rootdir}/.soyz/relations.json`;
/**
 * 初始化数据,get数据
 */
exports.initStructure = function () {
    const isExistMsgJson = fs.existsSync(msgdir);
    if (!isExistMsgJson) {
        fs.writeFileSync(msgdir, '');
    }
    var data = fs.readFileSync(msgdir, 'utf8');
    
    if (data) {
        try{
            structure = JSON.parse(data);
        } catch (e) {
            console.error('not json data: ' + e);
            structure = {};
        }
    } else {
        structure = {};
    }
    if (!structure.dirList) {
        structure.dirList = [];
        getRootDir(process.cwd());
    }
    if (!structure.relations) {
        structure.relations = {};
    }
    if (!structure.dependencies) {
        structure.dependencies = getDependencies();
    }
    return structure;
}

exports.saveStructure = function () {
    fs.writeFileSync(msgdir, JSON.stringify(structure, null, 4));
}


// 忽略的文件夹名字
const ignoreDirs = config.ignoreDirs;

/**
 * 读取根目录结构
 */
function getRootDir(path) {
    const isExist = fs.existsSync(path);
    if (isExist) {
        const list = fs.readdirSync(path);
        list.forEach(name => {
            var currPath = `${path}/${name}`;
            var stat = fs.statSync(currPath);
            if (stat.isDirectory() && ignoreDirs.indexOf(name) === -1 && !/^\./.test(name)) {
                structure.dirList.push(name);
            }
        })
    }
}