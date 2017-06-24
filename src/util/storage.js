import * as uuid from 'uuid/v1';

// 获取
export function getFileList(name) {
    var Name = name || 'batList';
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
export function addToList(id, dir, name) {
    var List = getFileList();
    id = id || `_${uuid()}`;
    const isExistBat = List.filter(item => {
        return (item.dir === dir && item.name === name && item.id !== id);
    })
    if (isExistBat.length === 0) {
        const curr = { id: id, dir: dir, name: name };
        List.push(curr);
        saveIn('fileInfo', List);
        return curr;
    }
    return isExistBat[0];
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
