/**
 * 本文件中所有io操作都必须是同步
 */
const fs = require('fs');
const path = require('path');
const uuid = require('uuid/v1');
const { getDependencies } = require('./tools.js');

const rootdir = process.cwd();
const tempDir = 'app'; //后期可以cut
const DIR = `${rootdir}/${tempDir}`; //后期可以cut

//后缀名，目前按.js
const extname = '.js';
const structure = {};
try {
    structure = require('../conf/relations.json');
    structure[tempDir] = structure.relations;
} catch (e) {
    structure[tempDir] = {};
}

/**
 * 生成文档结构和关系
 */
exports.generateSt = path => {
    getRootDir(DIR);
    readdir(DIR);
    structure.dependencies = getDependencies();
    structure.relations = structure[tempDir];
    delete structure[tempDir];
    fs.writeFileSync('./server/conf/relations.json', JSON.stringify(structure, null, 4));
}
/**
 * 读取根目录结构
 */
function getRootDir(path){
    const isExist = fs.existsSync(path);
    if (isExist) {
        structure.dirList = fs.readdirSync(path);
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
            if (stat.isDirectory()) {
                readdir(currPath);
            }
            if (stat.isFile()) {
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
    path = path.replace(rootdir, '').replace(`/${tempDir}`, '');
    if (!path) {
        path = '/entry';
    }
    path = path.substr(1);
    if (!structure[tempDir][path]) {
        structure[tempDir][path] = {};
    }
    structure[tempDir][path][name] = {};
    structure[tempDir][path][name].id = '_' + uuid();
    structure[tempDir][path][name].dir = path.split('/')[0] || path.split('/')[1];
    structure[tempDir][path][name].input = modules || [];
    structure[tempDir][path][name].pos = {};
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
                module = path.resolve(currPath, module);
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
