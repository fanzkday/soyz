const uuid = require('uuid/v1');
/**
 * 获取项目的依赖name
 */
exports.getDevDependencies = function () {
    const package = require(`../../package.json`);
    const modulesName = [];
    for (var key in package.dependencies) {
        modulesName.push({ name: key, id: `_${uuid()}`});
    }
    return modulesName;
}