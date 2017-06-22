import * as $ from 'jquery';
import * as d3 from 'd3';
import socket from '../../util/socket.js';
import { getFileList } from '../../util/storage.js';

//常量
const width = 6;

//battery相关
var batteryName, batteryX, batteryY, inputX, inputY, outputX, outputY;

//临时数据
var currPath, tempX, tempY;

//用于输出的battery 和 用于接收的battry的 path
var inputId, outputId;

//获取battery元素的坐标信息
function getPos(that) {
    batteryX = $(that).offset().left;
    batteryY = $(that).offset().top;
    outputX = $(that).children('.output').offset().left + width;
    outputY = $(that).children('.output').offset().top + width;
    inputX = $(that).children('.input').offset().left + width;
    inputY = $(that).children('.input').offset().top + width;
}
//保存battery元素的坐标信息
function savePos() {
    const data = {
        batteryName,
        batteryX,
        batteryY,
        inputX,
        inputY,
        outputX,
        outputY
    }
    sessionStorage.setItem('batteryInfo', JSON.stringify(data));
}
//计算bezier曲线点的位置
function curveTo(x1, y1, x4, y4) {
    x1 = Number(x1);
    y1 = Number(y1);
    x4 = Number(x4);
    y4 = Number(y4);
    var x2, x3;
    if (x1 < x4) {
        x2 = x3 = (x1 + x4) / 2;
    }
    if (x1 >= x4) {
        x2 = x1 + (x1 + x4) / 5;
        x3 = x4 - (x1 + x4) / 5;
    }
    return `M${x1} ${y1} C${x2} ${y1}, ${x3} ${y4}, ${x4} ${y4}`;
}

//获取battery的id
function getId(that) {
    return $(that).attr('id') || $(that).parents('.battery').attr('id');
}
//生成路径文字
function pathText(id, texts) {
    sessionStorage.setItem('isPathText', 'is');
    const isPathText = sessionStorage.getItem('isPathText');
    if (isPathText === 'is') {
        const text = d3.select('#svg svg').append('text')
            .attr('id', id)
            .attr('dy', '-5px');
        text.append('textPath')
            .attr('startOffset', '30%')
            .attr('xlink:href', id)
            .text(texts);
        text.append('textPath')
            .style('font-size', '12px')
            .style('fill', 'red')
            .attr('startOffset', '15%')
            .attr('class', 'Cut')
            .attr('xlink:href', id)
            .text('Cut');
    }
}
//移动battery时事件
function batteryDown(event) {
    var that = this;
    //如果battery是 only_output， 不可移动；
    if (that.className.indexOf('only_output') !== -1) return;
    //点击点
    var downX = event.clientX;
    var downY = event.clientY;
    //battery的top,left
    var startX = $(that).offset().left;
    var startY = $(that).offset().top;

    var batteryId = getId(that);

    //battery的input端path
    var inputPaths = $(`path[input=${batteryId}]`);
    var inputPathsSize = inputPaths.length;

    var pathsInputM = [];
    if (inputPathsSize > 0) {
        inputPaths.each((index, elem) => {
            pathsInputM.push(elem.getAttribute('start'));
        })
    }
    //battery的output端path
    var outputPaths = $(`path[output=${batteryId}]`);
    var outputPathsSize = outputPaths.length;

    var pathsOutputM = [];
    if (outputPathsSize > 0) {
        outputPaths.each((index, elem) => {
            pathsOutputM.push(elem.getAttribute('end'));
        })
    }

    $(document).on('mousemove', event => {
        getPos(that);
        var moveX = event.clientX;
        var moveY = event.clientY;
        //渲染battery及其输入端，输出端的path
        inputPaths.each((index, elem) => {
            var inputM = pathsInputM[index].split(',');
            elem.setAttribute('d', curveTo(inputM[0], inputM[1], inputX, inputY));
            elem.setAttribute('end', `${inputX},${inputY}`);
        })
        outputPaths.each((index, elem) => {
            var outputM = pathsOutputM[index].split(',');
            elem.setAttribute('d', curveTo(outputX, outputY, outputM[0], outputM[1]));
            elem.setAttribute('start', `${outputX},${outputY}`);
        })
        $(that).css({ top: startY + moveY - downY, left: startX + moveX - downX });
    })

    $(document).on('mouseup', '.battery', () => {
        $(document).off('mousemove');
        $(document).off('mouseup');
        savePos();
    })
}
// input mouseup 事件
function inputUp(event) {
    event.stopPropagation();
    var that = this;

    inputId = getId(that);
    console.log(inputId);
    console.log('============');
    inputX = $(that).offset().left + width;
    inputY = $(that).offset().top + width;

    if (tempX && tempY && currPath) {
        currPath.attr('d', curveTo(tempX, tempY, inputX, inputY));
        const id = outputId + inputId;
        currPath.attr('input', inputId).attr('end', `${inputX},${inputY}`).attr('id', id);

        let fromPath, toPath;
        var List = getFileList();
        console.log(List);
        List.forEach(item => {
            if (item.id === outputId) {
                fromPath = { dir: item.dir, name: item.name };
            }
            if (item.id === inputId) {
                toPath = { dir: item.dir, name: item.name };
            }
        })
        socket.emit('build-relation', { fromPath, toPath });
        //生成路径文字
        const fromText = fromPath.dir ? `${fromPath.dir}/${fromPath.name}` : fromPath.name;
        const toText = toPath.dir ? `${toPath.dir}/${toPath.name}` : toPath.name;
        pathText(`#${id}`, `${fromText} TO ${toText}`);

        $(document).off('mousemove');
        tempX = tempY = currPath = inputId = outputId = '';
    }
}
// output mousedown
function outputDown(event) {
    event.stopPropagation();
    var that = this;

    outputId = getId(that);

    tempX = $(that).offset().left + width;
    tempY = $(that).offset().top + width;

    currPath = d3.select('#svg svg').append('path');
    currPath.attr('output', outputId).attr('start', `${tempX},${tempY}`);

    $(document).on('mousemove', event => {
        currPath.attr('d', curveTo(tempX, tempY, event.clientX, event.clientY));
    })

    $(document).on('mouseup', () => {
        currPath && currPath.remove();
        inputId = outputId = '';
        $(document).off('mousemove');
        $(document).off('mouseup');
    })
}


$('body').on('mousedown', 'div.battery', batteryDown);
$('body').on('mousedown', 'span.output', outputDown);
$('body').on('mouseup', 'span.input', inputUp);

// 给所有的textPath添加click事件，用于切断联系
$('body').on('click', 'textPath.Cut', e => {
    const parent = $(e.target).parent('text');
    const id = parent.attr('id'); //获取的id本身就带有#号
    parent.remove();
    $(`path${id}`).remove();
});