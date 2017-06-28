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
const extname = config.extname;
// 需要匹配的文件后缀名
const standard = config.standard;

const rootdir = process.cwd();

var structure = {};

const msgdir = Path.resolve(__dirname, '../') + '/conf/relations.json';

const isExistMsgJson = fs.existsSync(msgdir);
if (isExistMsgJson) {
    const relations = fs.readFileSync(msgdir, 'utf8');
    structure = JSON.parse(relations);
}

/**
 * 生成文档结构和关系
 */
exports.generateSt = () => {
    structure.dirList = [];
    getRootDir(rootdir);
    readdir(rootdir);
    structure.dependencies = getDependencies();
    fs.writeFileSync(msgdir, JSON.stringify(structure, null, 4));
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
            if (stat.isFile() && extname === Path.extname(name)) {
                var modules = searchModulePath(currPath);
                setJson(currPath, modules);
            }
        })
    }
}
/**
 * 生成structure结构
 */
function setJson(currPath, modules) {
    currPath = currPath.replace(rootdir, '');
    if (!structure.relations[currPath]) {
        structure.relations[currPath] = {
            id: '_' + uuid(),
            dir: Path.dirname(currPath),
            name: Path.basename(currPath),
            input: modules,
            pos: {}
        }
    }
}

/**
 * 读取文件中包含信息，提取 import {} from 'antd'中的'antd'
 */
function searchModulePath(path) {
    const reg = new RegExp(standard, 'g');
    if (typeof path === 'string') {
        const data = fs.readFileSync(path, 'utf8');
        var allResult = data.match(reg) || [];
        var matchResult = allResult.map(item => {
            return item.match(/(\".*\")|(\'.*\')/)[0].replace(/"|'/g, '');
        })
        return parseModulePath(path, matchResult);
    }
}
/**
 * 把'../model/index'解析成 /model/index.js;
 */
function parseModulePath(currPath, moduleArr) {
    if (Array.isArray(moduleArr)) {
        currPath = Path.dirname(currPath);
        const result = moduleArr.map(module => {
            const Reg = /^(\.\.\/|\.\/)/;
            if (Reg.test(module)) {
                module = Path.resolve(currPath, module);
                var stat;
                try {
                    stat = fs.statSync(module);
                } catch (e) {
                    stat = fs.statSync(module + extname);
                }
                if (stat.isDirectory()) {
                    module = `${module}/index${extname}`;
                } else {
                    module = fs.existsSync(module + extname) ? (module + extname) : module;
                }
                return module.replace(rootdir, '').replace(/\\|\//g, '/');
            }
            return module;
        })
        return result;
    }
}
