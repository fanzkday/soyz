//所有bat的信息
var relations = {};

//向外暴露数据
export function getRelationData() {
    return relations;
}

//对内保存数据
export function saveRelationData(data){
    relations = data;
}