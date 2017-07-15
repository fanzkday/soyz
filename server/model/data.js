const fs = require('fs');
const Path = require('path');
const uuid = require('uuid/v1');

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
            structure = {};
        }
    } else {
        structure = {};
    }
    structure.dirList =  getRootDir(rootdir);
    structure.dependencies = getDependencies();
    if (!structure.relations) {
        structure.relations = {};
    }
    return structure;
}

exports.saveStructure = function (data) {
    try{
        data = JSON.stringify(data, null, 4);
    } catch(e) {
        data = {};
    }
    fs.writeFileSync(msgdir, data);
}


// 忽略的文件夹名字
const ignoreDirs = config.ignoreDirs;

/**
 * 读取根目录结构
 */
function getRootDir(path) {
    const dirList = [];
    const isExist = fs.existsSync(path);
    if (isExist) {
        const list = fs.readdirSync(path);
        list.forEach(name => {
            var currPath = `${path}/${name}`;
            var stat = fs.statSync(currPath);
            if (stat.isDirectory() && ignoreDirs.indexOf(name) === -1 && !/^\./.test(name)) {
                dirList.push(name);
            }
        })
    }
    return dirList;
}

/**
 * 获取项目的依赖name
 */
function getDependencies() {
    var package;
    try {
        package = JSON.parse(fs.readFileSync(`${rootdir}/package.json`));
    } catch (e) {
        return [];
    }
    const modulesName = [];
    for (var key in package.dependencies) {
        modulesName.push({ name: key, id: `_${uuid()}` });
    }
    return modulesName;
}
