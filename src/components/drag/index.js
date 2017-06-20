import * as $ from 'jquery';
import * as d3 from 'd3';
import socket from '../../util/socket.js';
//常量
const width = 6;

//battery相关
var batteryName, batteryX, batteryY, inputX, inputY, outputX, outputY;

//临时数据
var currPath, tempX, tempY;

//用于输出的battery 和 用于接收的battry的 path
var outputBatteryPath, inputBatteryPath;

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
        x2 = x1 + (x1 + x4) / 4;
        x3 = x4 - (x1 + x4) / 4;
    }
    return `M${x1} ${y1} C${x2} ${y1}, ${x3} ${y4}, ${x4} ${y4}`;
}
//获取battery的名字并格式化 用于className
function formatToClass(that) {
    var name = $(that).siblings('p').text() || $(that).children('p').text();
    if (typeof name === 'string') {
        name = name.replace(/^\s*/, '').replace(/\s*&/, '').replace('/', '_').replace('.', '-');
    }
    return name;
}
//获取battery的名字并格式化 用于text显示
function formatToText(that) {
    var name = $(that).siblings('p').text() || $(that).children('p').text();
    if (typeof name === 'string') {
        name = name.replace(/^\s*/, '').replace(/\s*&/, '').replace('/', '_').replace('.', '-');
    }
    return name;
}
//生成路径文字
function pathText(id, text) {
    console.log(typeof text, text);
    sessionStorage.setItem('isPathText', 'is');
    const isPathText = sessionStorage.getItem('isPathText');
    if (isPathText === 'is') {
        const text = d3.select('#svg svg').append('text')
            .attr('id', id)
            .attr('dy', '-5px');
        text.append('textPath')
            .attr('startOffset', '45%')
            .attr('xlink:href', id)
            .text(text);
        text.append('textPath')
            .style('font-size', '15px')
            .style('fill', 'red')
            .attr('startOffset', '35%')
            .attr('class', 'clip')
            .attr('xlink:href', id)
            .text('Clip');
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

    batteryName = formatToClass(that);

    //var outputPaths = d3.selectAll(`#svg .${batteryName}_output`);
    //battery的input端
    var inputPaths = $(`#svg .${batteryName}_input`);
    var inputPathsSize = inputPaths.length;

    var pathsInputM = [];
    if (inputPathsSize > 0) {
        inputPaths.each((index, elem) => {
            pathsInputM.push(elem.getAttribute('start'));
        })
    }
    //battery的output端
    var outputPaths = $(`#svg .${batteryName}_output`);
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

    var name = inputBatteryPath = formatToClass(that);

    inputX = $(that).offset().left + width;
    inputY = $(that).offset().top + width;

    if (tempX && tempY && currPath) {
        currPath.attr('d', curveTo(tempX, tempY, inputX, inputY));
        var className = currPath.attr('class');
        var id = 'mypath';
        currPath.attr('class', `${className} ${name}_input`).attr('end', `${inputX},${inputY}`).attr('id', id);

        //生成路径文字
        const text = `${name} from ${className}`.replace('_output', '');
        pathText(`#${id}`, 'text');

        socket.emit('build-relation', { outputBatteryPath, inputBatteryPath });

        $(document).off('mousemove');
        tempX = tempY = currPath = '';
    }
}
// output mousedown
function outputDown(event) {
    event.stopPropagation();
    var that = this;

    var name = outputBatteryPath = formatToClass(that);
    console.log('outputDown:' + name);
    tempX = $(that).offset().left + width;
    tempY = $(that).offset().top + width;

    currPath = d3.select('#svg svg').append('path');
    currPath.attr('class', `${name}_output`).attr('start', `${tempX},${tempY}`);

    $(document).on('mousemove', event => {
        currPath.attr('d', curveTo(tempX, tempY, event.clientX, event.clientY));
    })

    $(document).on('mouseup', () => {
        currPath && currPath.remove();
        outputBatteryPath = '';
        $(document).off('mousemove');
        $(document).off('mouseup');
    })
}


$('body').on('mousedown', 'div.battery', batteryDown);
$('body').on('mousedown', 'span.output', outputDown);
$('body').on('mouseup', 'span.input', inputUp);

// 给所有的textPath添加click事件，用于切断联系
$('body').on('click', 'textPath.clip', e => {
    const parent = $(e.target).parent('text');
    const id = parent.attr('id'); //获取的id本身就带有#号
    parent.remove();
    $(`path${id}`).remove();
});