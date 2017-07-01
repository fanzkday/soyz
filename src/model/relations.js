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
