const fs = require('fs');
const uuid = require('uuid/v1');
const rootdir = process.cwd();
/**
 * 获取项目的依赖name
 */
exports.getDependencies = function () {
    var package;
    try {
        package = JSON.parse(fs.readFileSync(`${rootdir}/package.json`));
    } catch (e) {
        console.error('package.json is not exist!');
        return [];
    }
    const modulesName = [];
    for (var key in package.dependencies) {
        modulesName.push({ name: key, id: `_${uuid()}` });
    }
    return modulesName;
}