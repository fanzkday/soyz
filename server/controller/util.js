const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

const { projectPath } = require('../conf/path.json');

var millisecond = '', RegExp = /(\.js|\.json|\.css|\.html)$/;
/**
 * 监听项目目录下文件的变化
 */
exports.watch = (path, socket) => {
    const watcher = chokidar.watch(path);
    watcher.on('all', (event, path, stat) => {
        if (new Date().getTime() - millisecond > 500) {
            const name = cutPath(path);
            socket.emit('fileChange', { event, name });
            millisecond = new Date().getTime();
        }
    })
}
/**
 * 对路径进行修剪 app\a\b.js => a b
 */
function cutPath(path) {
    var name = path.replace(RegExp, '').replace(/^app\\/, '');
    if (name.indexOf('\\') != -1) {
        name = name.split('\\');
    }
    return name;
}
/**
 * 获取项目的目录结构
 */
exports.getStructure = () => {
    const folderNames = [];
    const dirList = fs.readdirSync(projectPath);
    dirList.forEach(dir => {
        const o = {
            name: dir
        };
        const stat = fs.statSync(`${projectPath}/${dir}`);
        if (stat.isDirectory()) {
            o.type = 'directory';
        }
        if (stat.isFile()) {
            o.type = 'file';
        }
        folderNames.push(o);
    })
    fs.writeFileSync(`./server/conf/structrue.json`, JSON.stringify(folderNames, null, 4));
    return folderNames;
}

/**
 * app目录下建立项目结构
 */
exports.makeDir = structure => {
    console.log(structure);
    //创建文件夹
    structure.dir.forEach(name => {
        let path = `${projectPath}/${name}`;
        let isExist = fs.existsSync(path);
        if (!isExist) {
            fs.mkdir(path, err => {
                if (err) throw err;
            })
        }
    })
    //创建文件
    const entry = trim(structure.entry);
    let path = `${projectPath}/${entry}`;
    let isExist = fs.existsSync(path);
    if (!isExist) {
        fs.writeFile(path, '', err => {
            if (err) throw err;
        })
    }
}

/**
 * 在目标文件夹下新建文件
 */
exports.makeFile = obj => {
    console.log(obj);
    if (obj.dir && Array.isArray(obj.filename)) {
        const dir = trim(obj.dir);

        obj.filename.forEach(name => {
            const path = `${projectPath}/${dir}/${name}`;
            newFile(path);
        })
    }
}

/**
 * 两个文件之间建立引用关系
 */
exports.buildRelations = relation => {
    console.log(relation);
    if (typeof relation === 'object' && relation.fromPath && relation.toPath) {

        var fromPath, toPath;
        if (!relation.fromPath.dir) {
            toPath = `${projectPath}/${relation.toPath.dir}/${relation.toPath.name}`;

            const name = upperFirstLetter(relation.fromPath.name);
            const line = `import * as ${name} from '${name}';\r\n`;
            const isExist = fs.existsSync(toPath);
            if (!isExist) return;
            try {
                const data = fs.readFileSync(toPath, 'utf8');
                fs.writeFileSync(toPath, `${line}${data}`, 'utf8');
            } catch (e) {
                console.log(e);
            }
        }
        // var result = path.relative(fromPath, toPath);
        // console.log(result);
    }
}
//字符串首字母大写
function upperFirstLetter(str) {
    if (typeof str !== 'string')
        return str;
    return str.replace(/^\w/, m => m.toUpperCase());
}
//去除空格
function trim(str) {
    if (typeof str !== 'string')
        return str;
    return str.replace(/^\s*/, '').replace(/\s*$/, '');
}
//new file
function newFile(path) {
    const isExist = fs.existsSync(path);
    if (!isExist) {
        fs.writeFile(path, '', err => {
            if (err) throw err;
        })
    }
}