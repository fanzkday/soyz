import * as $ from 'jquery';
import * as d3 from 'd3';
import { getRelationData } from '../model/relations.js';

// 框选
$(document).on('mousedown', e => {
    const startX = e.clientX;
    const startY = e.clientY;
    const rect = d3.select('#select svg').append('rect');
    rect.attr('x', startX).attr('y', startY);
    var endX, endY;
    $(document).on('mousemove', e => {
        endX = e.clientX;
        endY = e.clientY;
        renderRect(rect, startX, startY, endX, endY);
    })
    $(document).on('mouseup', () => {
        $(document).off('mousemove');
        $(document).off('mouseup');
        rect.remove();
        selectedBat(startX, startY, endX, endY);
    })
})

//绘制框选范围的矩形
function renderRect(rect, startX, startY, endX, endY) {
    const width = endX - startX;
    const height = endY - startY;
    if (endX > startX) {
        rect.attr('x', startX).attr('width', width);
    } else {
        rect.attr('x', endX).attr('width', -width);
    }
    if (endY > startY) {
        rect.attr('y', startY).attr('height', height);
    } else {
        rect.attr('y', endY).attr('height', -height);
    }
}

//根据框选范围，给符合条件的元素添加class
function selectedBat(startX, startY, endX, endY) {
    const relations = getRelationData().relations;
    console.log(relations);
    for (var key in relations) {
        const element = relations[key];
        const x = element.pos.x;
        const y = element.pos.y;
        if ((x > startX && x < endX) || (x < startX && x > endX)) {
            if ((y > startY && y < endY) || (y < startY && y > endY)) {
                $(`#${element.id}`).addClass('selected');
            }
        }
    }
}

