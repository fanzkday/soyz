const fs = require('fs');
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
  if (Array.isArray(structure.directory)) {
    structure.directory.forEach(name => {
      fs.mkdir(`${projectPath}/${name}`, err => {
        if (err) throw err;
      })
    })
  }
  //创建文件
  if (typeof structure.entry === 'string' && RegExp.test(structure.entry)) {
    fs.writeFile(`${projectPath}/${structure.entry}`, '', err => {
      if (err) throw err;
    })
  }
}

/**
 * 在目标文件夹下新建文件
 */
exports.makeFile = obj => {
  if (obj.folderName && obj.fileName && RegExp.test(obj.fileName)) {
    fs.writeFile(`${projectPath}/${obj.folderName}/${obj.fileName}`, '', err => {
      if (err) throw err;
    })
  }
}