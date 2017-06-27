/**
 * 本文件中所有io操作都必须是同步
 */
const fs = require('fs');
const Path = require('path');
const uuid = require('uuid/v1');
const config = require('../conf/config.json');
const { getDependencies } = require('./tools.js');

// 忽略的文件夹名字
const ignoreDirs = config.ignoreDirs;
// 需要匹配的文件后缀名
const matchExtFile = config.matchExtFile;


const rootdir = process.cwd();

var structure = {};
try {
    var relations = fs.readFileSync('./server/conf/relations.json', 'utf8');
    if (relations) {
        structure = JSON.parse(relations);
    } else {
        structure.relations = {};
    }
} catch (e) {
    console.log(e);
}
structure.dirList = [];
/**
 * 生成文档结构和关系
 */
exports.generateSt = () => {
    getRootDir(rootdir);
    readdir(rootdir);
    structure.dependencies = getDependencies();

    fs.writeFileSync('./server/conf/relations.json', JSON.stringify(structure, null, 4));
}
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
                console.log(stat);
                structure.dirList.push(name);
            }
        })
    }
}
/**
 * 读取所有目录结构
 */
function readdir(path) {
    const isExist = fs.existsSync(path);
    if (isExist) {
        const dirList = fs.readdirSync(path);
        dirList.forEach(name => {
            var currPath = `${path}/${name}`;
            var stat = fs.statSync(currPath);
            if (stat.isDirectory() && ignoreDirs.indexOf(name) === -1) {
                readdir(currPath);
            }
            if (stat.isFile() && matchExtFile.indexOf(Path.extname(name)) !== -1) {
                var modules = searchModulePath(currPath);
                setJson(path, name, modules);
            }
        })
    }
}
/**
 * 生成structure结构
 */
function setJson(path, name, modules) {
    path = path.replace(rootdir, '');
    console.log(structure);
    console.log(path);
    if (!path) {
        path = '/entry';
    }
    path = path.substr(1);
    if (!structure.relations[path]) {
        structure.relations[path] = {};
    }
    structure.relations[path][name] = {};
    structure.relations[path][name].id = '_' + uuid();
    structure.relations[path][name].dir = Path.dirname(path);
    structure.relations[path][name].input = modules || [];
    structure.relations[path][name].pos = {};
}
/**
 * 根据的提供的path，生成[]
 */
function formatPath(path) {
    if (typeof path === 'string') {
        return path.replace(rootdir, '').split('/').slice(1);
    }
    return path;
}

/**
 * 读取文件中包含信息，提取 import {} from 'antd'中的'antd'
 */
function searchModulePath(path) {
    if (typeof path === 'string') {
        const data = fs.readFileSync(path, 'utf8');
        var allResult = data.match(/\bimport.*(.*|from).*((\'.*\')|(\".*\"))/g) || [];
        var matchResult = allResult.map(item => {
            return item.match(/(\".*\")|(\'.*\')/)[0].replace(/"|'/g, '');
        })

        return parseModulePath(path, matchResult);
    }
}
/**
 * 把'../model/index[.js]'解析成 ['model', 'index.js'];
 */
function parseModulePath(currPath, moduleArr) {
    if (Array.isArray(moduleArr)) {
        const result = moduleArr.map(module => {
            const Reg = /^(\.\.\/|\.\/)/;
            if (Reg.test(module)) {
                currPath = currPath.replace(/(\\|\/){1}\w*\.\w*$/, '');
                module = Path.resolve(currPath, module);
                const stat = fs.statSync(module);
                if (stat.isDirectory()) {
                    module = `${module}/index${extname}`;
                }
                return module.replace(rootdir, '').split(/\\|\//).slice(2);
            }
            return module;
        })
        return result;
    }
    return moduleArr;
}
