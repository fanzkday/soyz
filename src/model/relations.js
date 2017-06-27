//所有bat的信息
var info = {};

//向外暴露数据
export function getRelationData() {
    return info;
}

//对内保存数据
export function saveRelationData(data){
    info = data;
}

//修改坐标
export function updatePosition(id, x, y){
    for (var key in info.relations) {
        const element = info.relations[key];
        if (element.id === id) {
            element.pos.x = x;
            element.pos.y = y;
        }
    }
}