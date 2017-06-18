import * as $ from 'jquery';
import * as d3 from 'd3';

var currLine,
    batteryName,
    batteryX,
    batteryY,
    inputX,
    inputY,
    outputX,
    outputY,
    width = 6;
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
//移动battery时事件
function batteryEvent(e) {
    var that = e.target;
    var x1 = e.clientX;
    var y1 = e.clientY;
    var startX = $(that).offset().left;
    var startY = $(that).offset().top;
    var name = $.trim($(that).text());
    var outputLines = d3.selectAll('#svg .' + name + 0);
    var inputLines = d3.selectAll('#svg .' + name + 1);
    $(document).on('mousemove', e => {
        var x2 = e.clientX;
        var y2 = e.clientY;
        batteryName = $.trim($(e.target).text())
        getPos(that);
        outputLines.attr('x1', outputX).attr('y1', outputY);
        inputLines.attr('x2', inputX).attr('y2', inputY);
        $(that).css({ top: startY + y2 - y1, left: startX + x2 - x1 });
    })
    $(that).on('mouseup', e => {
        $(document).off('mousemove');
        savePos();
    })
    $(document).on('mouseup', '.battery', e => {
        $(document).off('mousemove');
        savePos();
    })
}
// input mouseup 事件
function inputUp(e) {
    var that = e.target;
    var name = $.trim($(that).parent().text());
    inputX = $(that).offset().left + width;
    inputY = $(that).offset().top + width;
    if (outputX && outputY) {
        currLine.attr('x2', inputX).attr('y2', inputY);
        var className = currLine.attr('class');
        currLine.attr('class', className + ' ' + name + 1);
        $(document).off('mousemove');
        outputX = outputY = currLine = '';
    }
}
// input mousedown 事件
function outputDown(e) {
    var that = e.target;
    var name = $.trim($(that).parent().text()).replace(' > ', '_');
    outputX = $(that).offset().left + width;
    outputY = $(that).offset().top + width;
    currLine = d3.select('#svg svg').append('line');
    currLine.attr('class', name + 0);
    $(document).on('mousemove', e => {
        var x1 = e.clientX;
        var y1 = e.clientY;
        currLine.attr('x1', outputX).attr('y1', outputY)
            .attr('x2', x1).attr('y2', y1);
    })
}

$('body').on('mousedown', e => {
    if (e.target.className.indexOf('battery') !== -1) {
        batteryEvent(e);
    }
});
$('body').on('mouseup', '.input', e => {
    if (e.target.className.indexOf('input') !== -1) {
        inputUp(e);
    }
});
$('body').on('mousedown', '.output', e => {
    if (e.target.className.indexOf('output') !== -1) {
        outputDown(e);
    }
});
