const fs = require('fs');
const Path = require('path');

const rootdir = process.cwd();


const config = require(`${rootdir}/.soyz/config.json`);
const standard = config.standard;
/**
 * 两个文件之间建立引用关系
 */
exports.buildRelations = relation => {
    if (typeof relation === 'object' && relation.fromA && relation.toB) {
        var fromPath, toPath;
        //引用的公共模块
        if (!relation.toB.dir) {
            doneRelation(relation.fromA.dir, relation.toB.name, relation.moduleName);
            //多个文件之间的引用
        } else {
            const fromPath = Path.dirname(relation.fromA.dir);
            const text = Path.relative(fromPath, relation.toB.dir).replace(/\\/g, '/');
            doneRelation(relation.fromA.dir, text, relation.moduleName);
        }
    }
}

/**
 * 把引用关系写入到文件中 
 */
function doneRelation(targetPath, text, moduleName) {
    var line;
    if (standard === 'ES6') {
        line = `import { ${moduleName} } from '${text}';\r\n`;
    } else if (standard === 'CommonJs') {
        line = `const { ${moduleName} } = require('${text}');\r\n`;
    }
    try {
        const currPath = rootdir + targetPath;
        const isExist = fs.existsSync(currPath);
        if (!isExist) return;
        const data = fs.readFileSync(currPath, 'utf8');
        fs.writeFileSync(currPath, `${line}${data}`, 'utf8');
    } catch (e) {
        console.log(`${currPaht} is not exist!`);
    }
}

//获取文件暴露的模块名
exports.getFileModuleName = function (filename) {
    if (standard === 'ES6') {
        console.log(filename);
        const modules = require(`${rootdir}${filename}`);
        console.log(modules);
    }
}
