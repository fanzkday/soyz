
import { saveRelationData, getRelationData } from '../model/relations.js';
import socket from '../util/socket.js';
import { createModuleBat, createBats, createRelations } from '../dom/render.js';

socket.emit('init', 'init');
socket.once('init', data => {
    if (data && typeof data === 'object') {
        //把数据保存在model中
        saveRelationData(data);
        const posArr = [];
        //渲染module
        createModuleBat(data);
        //渲染Bat和relations, 并记录坐标信息
        createBats(getRelationData().relations, posArr);
        createRelations(data);
        //将所有的bat的坐标信息上报服务器
        socket.emit('position', posArr);
    }
})