
const fs = require('fs');
const Path = require('path');
const uuid = require('uuid/v1');

const { initStructure, saveStructure } = require('../model/data.js');

var rootdir = process.cwd();

const config = require(`${rootdir}/.soyz/config.json`);
// 需要匹配的文件后缀名
const extname = config.extname;
// 需要匹配的文件后缀名
const standard = config.standard;
// 忽略的文件夹名字
const ignoreDirs = config.ignoreDirs;

const structure = initStructure();
const newStructure = {
    dirList: [],
    relations: {},
    dependencies: []
}

/**
 * main函数
 */
exports.run = (path) => {
    this.readdir(path);
    saveStructure(newStructure);
}

/**
 * 读取所有目录结构
 */
exports.readdir = function readdir(path) {
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
        newStructure.relations[currPath] = {
            id: '_' + uuid(),
            dir: Path.dirname(currPath).split('/')[1],
            name: Path.basename(currPath),
            input: modules,
            pos: {}
        }
    }
    if (structure.relations[currPath]) {
        newStructure.relations[currPath] = structure.relations[currPath];
        newStructure.relations[currPath].input = modules;
    }
    newStructure.dirList = structure.dirList;
    newStructure.dependencies = structure.dependencies;
}

/**
 * 读取文件中包含信息模块引用关系
 */
function searchModulePath(path) {
    var reg;
    if (standard === 'ES6') {
        reg = /\bimport.*(.*|from).*((\'.*\')|(\".*\"))/g;
    }
    if (standard === 'CommonJs') {
        reg = /=\s?require\(((\'.*\')|(\".*\"))\)/g;
    }

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
                } finally {
                    if (!stat) return;
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
