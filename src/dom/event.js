import * as $ from 'jquery';
import socket from '../util/socket.js';
import { curveTo } from '../util/tools.js';
import { pathText } from './render.js';
import { getBatList } from '../model/batList.js';

//常量
const width = 6;

//battery相关
var inputX, inputY, outputX, outputY;

//临时数据
var currPath, tempX, tempY;

//用于输出的battery 和 用于接收的battry的 path
var inputId, outputId;

//获取battery元素的坐标信息
function getPos(that) {
    outputX = $(that).children('.output').offset().left + width;
    outputY = $(that).children('.output').offset().top + width;
    inputX = $(that).children('.input').offset().left + width;
    inputY = $(that).children('.input').offset().top + width;
}

//获取battery的id
function getId(that) {
    return $(that).attr('id') || $(that).parents('.battery').attr('id');
}

//移动battery时事件
export function batteryDown(event) {
    event.stopPropagation();
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
    // 移动bat时，当前的坐标
    var currX, currY;
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
        currX = startX + moveX - downX;
        currY = startY + moveY - downY;
        $(that).css({ top: startY + moveY - downY, left: startX + moveX - downX });
    })
    $(document).on('mouseup', '.battery', () => {
        $(document).off('mousemove');
        $(document).off('mouseup');
        socket.emit('position', { batteryId, currX, currY });
    })
}
// input mouseup 事件
function inputUp(event) {
    event.stopPropagation();
    var that = this;

    inputId = getId(that);
    inputX = $(that).offset().left + width;
    inputY = $(that).offset().top + width;

    if (tempX && tempY && currPath) {
        currPath.attr('d', curveTo(tempX, tempY, inputX, inputY));
        const id = outputId + inputId;
        currPath.attr('input', inputId).attr('end', `${inputX},${inputY}`).attr('id', id);

        let fromPath, toPath;
        var List = getBatList();
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

    currPath = $('#svg svg').append('path');
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
function editBat(event) {
    var text = $(event.target).text().replace(/^\s*/, '').replace(/\s*$/, '');
    console.log(text);
    socket.emit('edit-file', text);
}

$('body').on('mousedown', 'div.battery', batteryDown);
$('body').on('dblclick', 'div.battery', editBat);

$('body').on('mousedown', 'span.output', outputDown);
$('body').on('mouseup', 'span.input', inputUp);

// 给所有的textPath添加click事件，用于切断联系
$('body').on('click', 'textPath.Cut', e => {
    const parent = $(e.target).parent('text');
    const id = parent.attr('id'); //获取的id本身就带有#号
    parent.remove();
    $(`path${id}`).remove();
});