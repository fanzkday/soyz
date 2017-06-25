import * as uuid from 'uuid/v1';

const batList = [];
// 获取
export function getBatList() {
    return batList;
}
// 增加, 每次增加一个文件，并返回文件的info
export function addToList(id, dir, name) {
    id = id || `_${uuid()}`;
    const isExistBat = batList.filter(item => {
        return (item.dir === dir && item.name === name && item.id !== id);
    })
    if (isExistBat.length === 0) {
        const curr = { id: id, dir: dir, name: name };
        batList.push(curr);
        return curr;
    }
    return isExistBat[0];
}
// 删除
export function removeFromList(id) {
    batList.forEach((item, index) => {
        if (item.id === id) {
            batList.splice(index, 1);
        }
    })
}
