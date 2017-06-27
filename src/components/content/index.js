import React from 'react';

import { saveRelationData, getRelationData } from '../../model/relations.js';
import socket from '../../util/socket.js';
import { createModuleBat, createBats, createRelations } from '../../dom/render.js';

export class Content extends React.Component {
    componentDidMount() {
        socket.emit('init', 'init');
        socket.once('init', data => {
            if (data && typeof data === 'object') {
                //把数据保存在model中
                saveRelationData(data);
                console.log(data);
                const posArr = [];
                //渲染module
                createModuleBat(data);
                //渲染Bat和relations
                createBats(getRelationData().relations, posArr);
                createRelations(data);
                //将所有的bat的坐标信息上报服务器
                socket.emit('position', posArr);
            }
        })
    }
    render() {
        return (
            <div id="content">
                <div className="module"></div>
            </div>
        )
    }
}
