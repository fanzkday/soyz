function drag(selector, callback) {
    var currLine, batteryX, batteryY, inputX, inputY, outputX, outputY, width = 8;
    function getPos(that) {
        batteryX = $(that).offset().left;
        batteryY = $(that).offset().top;
        outputX = $(that).children('.output').offset().left + width;
        outputY = $(that).children('.output').offset().top + width;
        inputX = $(that).children('.input').offset().left + width;
        inputY = $(that).children('.input').offset().top + width;
    }
    //
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
            outputLines.attr('x1', outputX).attr('y1', outputY);
            inputLines.attr('x2', inputX).attr('y2', inputY);
            $(that).css({ top: startY + y2 - y1, left: startX + x2 - x1 });
            getPos(that);
        })
        $(document).on('mouseup', e => {
            $(document).off('mousemove');
            var data = {
                x: batteryX,
                y: batteryY,
                input: {
                    x: inputX,
                    y: inputY
                },
                output: {
                    x: outputX,
                    y: outputY
                }
            }
            callback(data);
        })
    }
    // input mousedown 事件
    function inputDown(e) {
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
        var name = $.trim($(that).parent().text());
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

    return (function (selector) {
        $(selector).on('mousedown', e => {
            var className = e.target.className;
            if (/input/.test(className)) {
                inputDown(e);
            } else if (/output/.test(className)) {
                outputDown(e);
            } else {
                batteryEvent(e);
            }
        })
    })(selector)
}