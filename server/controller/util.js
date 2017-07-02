const fs = require('fs');
const Path = require('path');

const rootdir = process.cwd();

/**
 * 两个文件之间建立引用关系
 */
exports.buildRelations = relation => {
    if (typeof relation === 'object' && relation.fromA && relation.toB) {
        var fromPath, toPath;
        if (!relation.toB.dir) {
            doneRelation(relation.fromA.dir, relation.toB.name, 'ES6');
        } else {
            const fromPath = Path.dirname(relation.fromA.dir);
            var text = Path.relative(fromPath, relation.toB.dir).replace(/\\/g, '/');
            doneRelation(relation.fromA.dir, text, 'ES6');
        }

    }
}

/**
 * 把引用关系写入到文件中 
 */
function doneRelation(targetPath, text, standard) {
    const currPath = rootdir + targetPath;
    var line;
    if (standard === 'ES6') {
        line = `import {} from '${text}';\r\n`;
    } else if(standard === 'CommonJs') {
        line = `const {} = require('${text}')`;
    }
    const isExist = fs.existsSync(currPath);
    if (!isExist) return;
    try {
        const data = fs.readFileSync(currPath, 'utf8');
        fs.writeFileSync(currPath, `${line}${data}`, 'utf8');
    } catch (e) {
        console.log(e);
    }
}

//去除空格
function trim(str) {
    if (typeof str !== 'string')
        return str;
    return str.replace(/^\s*/, '').replace(/\s*$/, '');
}
