
// 获取
export function getFileList(name) {
    var Name = name || 'fileInfo';
    var List = sessionStorage.getItem(Name) || "[]";
    try {
        List = JSON.parse(List);
        return List;
    } catch (e) {
        console.error(e);
    }
    return [];
}
// 保存
export function saveIn(name, data) {
    sessionStorage.setItem(name, JSON.stringify(data));
}
// 增加, 每次增加一个文件，并返回文件的info
export function addToList(dir, name) {
    var List = getFileList();
    var id = uniqueId();
    const isExist = List.some(item => {
        return (item.dir === dir && item.name === name);
    })
    if (!isExist) {
        const curr = { id: id, dir: dir, name: name };
        List.push(curr);
        saveIn('fileInfo', List);
        return curr;
    }
}
// 删除
export function removeToList(id) {
    var List = getFileList();
    List.forEach((item, index) => {
        if (item.id === id) {
            List.splice(index, 1);
        }
    })
    saveIn('fileInfo', List);
}
// 生成唯一标识符
function uniqueId() {
    const random = Math.ceil(Math.random() * 100);
    return `_${new Date().getTime()}${random}${random}`;
}