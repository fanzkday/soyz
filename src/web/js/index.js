//全局变量设置
const HEIGHT = 70, X = -8, layers = [], folders = [];

const socket = io.connect('ws://localhost:3030');

$(document).ready(function () {
    //禁用浏览器鼠标邮件
    document.oncontextmenu = () => false;
    //初始化绘图
    drag('.box', data => {
        console.log(data);
    });
    //获取项目结构
    socket.emit('get-folders', '');
    socket.on('get-folders', data => {
        alert(data);
    })
})