/**
 * 本文件中所有io操作都必须是同步
 */
const fs = require('fs');
const uuid = require('uuid/v1');
const { getDevDependencies } = require('./tools.js');

var structure = {
    app: {},
    devDependencies: getDevDependencies()
};

/**
 * 生成文档结构和关系
 */
exports.generateSt = path => {
    readdir('./app');
    fs.writeFileSync('./server/conf/relations.json', JSON.stringify(structure, null, 4));
}
/**
 * 读取目录结构
 */
function readdir(path) {
    const isExist = fs.existsSync(path);
    if (isExist) {
        const dirList = fs.readdirSync(path);
        dirList.forEach(name => {
            var currPath = `${path}/${name}`;
            var stat = fs.statSync(currPath);

            if (stat.isDirectory()) {
                setJson(structure, formatPath(currPath));
                readdir(currPath);
            }
            if (stat.isFile()) {
                var modules = searchModulePath(currPath);
                setJson(structure, formatPath(currPath), 'isFile', modules);
            }
        })
    }
}
/**
 * 生成structure结构
 */
function setJson(obj, arr, flag, modules) {
    if (typeof obj === 'object' && Array.isArray(arr)) {
        var currAttr = obj[arr[0]];
        for (var i = 1; i < arr.length; i++) {
            var elem = arr[i];
            if (i === arr.length - 1) {
                currAttr[elem] = {};
                if (flag === 'isFile') {
                    currAttr[elem].id = `_${uuid()}`;
                    currAttr[elem].input = modules;
                    currAttr[elem].pos = {
                        x: randomPos().x,
                        y: randomPos().y
                    };
                }
            } else {
                currAttr = currAttr[elem];
            }
        }
    }
}
/**
 * 根据的提供的path，生成[]
 */
function formatPath(path) {
    if (typeof path === 'string') {
        console.log(path.split('/').slice(1));
        return path.split('/').slice(1);
    }
    return path;
}

/**
 * 读取文件中包含信息，提取 import {} from 'antd'中的'antd'
 */
function searchModulePath(path) {
    if (typeof path === 'string') {
        const data = fs.readFileSync(path, 'utf8');
        var allResult = data.match(/\bimport.*from.*((\'.*\')|(\".*\"))/g) || [];
        var matchResult = allResult.map(item => {
            return item.match(/(\'.*\')|(\".*\")/)[0];
        })
        return matchResult;
    }
}

/**
 * 生成随机的坐标
 */
function randomPos() {
    return {
        x: Math.ceil(Math.random() * 1300) + 100,
        y: Math.ceil(Math.random() * 800)
    }
}
