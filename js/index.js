//常量设置
var HEIGHT = 70, X = -8;

$(document).ready(function () {

    const socket = io.connect('ws://localhost:3030')
    const battery = {
        id: 0,
        name: "Title",
        desc: "...",
        pos: {
            top: 100,
            left: 100
        },
        input: [],
        output: [],
        relations: [],
        err: "",
        belong: "",
        isAdd: false
    }
    //初始化页面
    socket.emit('init', null)
    socket.on('init', data => {
        renderView(JSON.parse(data));
    })

    //新建battery
    $('#btn').on('click', () => {
        newCreate(battery);
    })

})
function newCreate(item) {
    var div = $('<div class="battery"></div>').appendTo($('#model'));
    div.attr('id', item.id).css({ top: item.pos.top, left: item.pos.left });
    $('<div class="name"></div>').appendTo(div).text(item.name);
    $('<div class="desc"></div>').appendTo(div).text(item.desc);
    //渲染input端口
    var inLenMin = HEIGHT / item.input.length / 2;
    item.input.forEach((input, i) => {
        $('<span class="input"><span>' + input.name + '</span></span>').appendTo(div).css({ top: inLenMin * (2 * i + 1) - 7, left: X });
    })
    //渲染output端口
    var outLenMin = HEIGHT / item.output.length / 2;
    item.output.forEach((output, i) => {
        $('<span class="output"></span>').appendTo(div).css({ top: outLenMin * (2 * i + 1) - 7, right: X });
    })
}
function buildRelations(item) {
    if (item.relations.length > 0) {
        item.relations.forEach(arr => {
            var outIndex = arr[0], batteryIndex = arr[1], inIndex = arr[2];
            var line = d3.select('#svg svg').append('line');
            line.attr('x1', item.output[outIndex].pos.x).attr('y1', item.output[outIndex].pos.y);
            line.attr('x2', data[batteryIndex].input[inIndex].pos.x).attr('y2', data[batteryIndex].input[inIndex].pos.y);
        })
    }
}
function renderView(data) {
    data.forEach(item => {
        newCreate(item);

        buildRelations(item);
    })
}