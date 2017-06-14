const fs = require('fs');
const chokidar = require('chokidar');

var millisecond = '';
/**
 * 监听项目目录下文件的变化
 */
exports.watch = function (path, socket) {
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
    var name = path.replace(/(\.js|\.json|\.css|\.html)$/, '').replace(/^app\\/, '');
    if (name.indexOf('\\') != -1) {
        name = name.split('\\');
    }
    return name;
}
/**
 * 获取项目的目录结构
 */
exports.getStructure = function (path) {
    const folderNames = [];
    const dirList = fs.readdirSync(path);
    dirList.forEach(dir => {
        const o = {
            name: dir
        };
        const stat = fs.statSync(`${path}/${dir}`);
        if (stat.isDirectory()) {
            o.type = 'directory';
        }
        if (stat.isFile()) {
            o.type = 'file';
        }
        folderNames.push(o);
    })
    fs.writeFileSync('./self/conf/structrue.json', JSON.stringify(folderNames, null, 4));
    return folderNames;
}