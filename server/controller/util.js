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
    //创建文件夹
    const directory = formatPath(structure.directory).split(' ');
    directory.forEach(name => {
        let path = `${projectPath}/${name}`;
        let isExist = fs.existsSync(path);
        if (!isExist) {
            fs.mkdir(path, err => {
                if (err) throw err;
            })
        }
    })
    //创建文件
    const entry = formatPath(structure.entry);
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
    if (obj.dirname && obj.filename && RegExp.test(obj.filename)) {
        const dirname = formatPath(obj.dirname);
        const filenames = formatPath(obj.filename).split(' ');

        filenames.forEach(name => {
            const path = `${projectPath}/${dirname}/${name}`;
            newFile(path);
        })
    }
}

/**
 * 两个文件之间建立引用关系
 */
exports.buildRelations = relation => {
    console.log(relation);
    if (typeof relation === 'object' && relation.outputBatteryPath && relation.inputBatteryPath) {

        const fromPath = `${projectPath}/${formatPath(relation.inputBatteryPath)}`;
        const toPath = formatPath(relation.outputBatteryPath);

        if (toPath.indexOf('/') === -1) {
            const name = upperFirstLetter(toPath);
            const line = `import * as ${name} from '${toPath}';\r\n`;
            const isExist = fs.existsSync(fromPath);
            if (!isExist) return;
            try {
                const data = fs.readFileSync(fromPath, 'utf8');
                fs.writeFileSync(fromPath, `${line}${data}`, 'utf8');
            } catch (e) {
                console.log(e);
            }
            return;
        }
        var result = path.relative(fromPath, toPath);
        console.log(result);
    }
}
//字符串首字母大写
function upperFirstLetter(str) {
    if (typeof str !== 'string') return;
    return str.replace(/^\w/, m => m.toUpperCase());
}
//去除空格，按约定把'_'转'/'，'-'转'.';
function formatPath(str) {
    if (typeof str !== 'string') return;
    return str.replace(/^\s*/, '').replace(/\s*$/, '').replace(/_/g, '/').replace(/-/g, '.');
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