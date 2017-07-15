import socket from '../util/socket.js';
import { curveTo } from '../util/feature.js';
import { pathText } from './render.js';
import { getRelationData } from '../model/relations.js';
import { inputContentMenu } from '../bat/index.js';

//常量
const width = 6;

//battery相关
var inputX, inputY, outputX, outputY;

//临时数据
var currPath, tempX, tempY;

//用于输出的battery 和 用于接收的battry的 path
var inputId, outputId;

//保存当前选择的模块名字
var moduleName;

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
function batteryDown(that, event) {
    event.stopPropagation();
    //如果battery是 only_output， 不可移动；
    if (that.className.indexOf('only_output') !== -1) return;
    //点击点
    var downX = event.clientX;
    var downY = event.clientY;
    //battery的top,left
    var startX = $(that).offset().left;
    var startY = $(that).offset().top;

    var batteryId = getId(that);
    $(that).addClass('selected');

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
            elem.setAttribute('move', 'true');
        })
        outputPaths.each((index, elem) => {
            var outputM = pathsOutputM[index].split(',');
            elem.setAttribute('d', curveTo(outputX, outputY, outputM[0], outputM[1]));
            elem.setAttribute('start', `${outputX},${outputY}`);
            elem.setAttribute('move', 'true');
        })
        $('path[move=true]').css({ stroke: '#888' });
        currX = startX + moveX - downX;
        currY = startY + moveY - downY;
        $(that).css({ top: currY, left: currX });
    })
    $(document).on('mouseup', '.battery', () => {
        $(document).off('mousemove');
        $(document).off('mouseup');
        $('.selected').removeClass('selected');
        $('path[move]').css({ stroke: '#ccc' }).attr('move', '');
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
        //判断两个文件之间是否已经建立联系
        if ($(`path#${id}`).length === 1) {
            const o = fromAndTo();
            socket.emit('build-relation', { fromA: o.fromPath, toB: o.toPath, moduleName: moduleName });
            //生成路径文字
            // pathText(`#${id}`, `import {${moduleName}} from ${o.toPath.name}`);
        } else {
            currPath.remove();
        }
        tempX = tempY = currPath = inputId = outputId = moduleName = '';
    }
}
// output mousedown
function outputDown(event) {
    event.stopPropagation();
    outputId = getId(this);
    tempX = $(this).offset().left + width;
    tempY = $(this).offset().top + width;

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
function editBat(event) {
    var name = $(event.target).text().replace(/^\s*/, '').replace(/\s*$/, '');
    var dir = $(event.target).prev('div').text().replace(/^\s*/, '').replace(/\s*$/, '');
    socket.emit('edit-file', dir + '/' + name);
}

$('body').on('mousedown', 'div.battery', event => {
    $('.selected').each((index, elem) => {
        batteryDown(elem, event);
    })
    batteryDown(event.currentTarget, event);
});
$('body').on('dblclick', 'div.battery', editBat);

$('body').on('mousedown', 'span.output', outputDown);
$('body').on('mouseup', 'span.input', inputUp);

function fromAndTo() {
    let fromPath, toPath;
    var List = getRelationData().relations;
    for (var key in List) {
        const elem = List[key];
        if (elem.id === outputId) {
            toPath = { name: elem.name, dir: key };
        }
        if (elem.id === inputId) {
            fromPath = { name: elem.name, dir: key };
        }
    }
    var dirList = getRelationData().dependencies;
    dirList.forEach(item => {
        if (item.id === outputId) {
            toPath = { name: item.name, dir: '' };
        }
        if (item.id === inputId) {
            fromPath = { name: item.name, dir: '' };
        }
    });
    return { fromPath, toPath };
}
