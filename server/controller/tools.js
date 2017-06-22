
/**
 * 获取项目的依赖name
 */
exports.getDevDependencies = function () {
    const package = require(`../../package.json`);
    const modulesName = [];
    for (var key in package.dependencies) {
        modulesName.push(key);
    }
    return modulesName;
}