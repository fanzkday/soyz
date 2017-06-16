/**
 * 页面中的动态效果
 */
$(document).ready(() => {
    var currX, currY;
    //开关设置面板
    $('#layer .title').on('click', () => {
        $('#layer .setting').fadeToggle(500);
    })
    //设置面板中添加输入框
    $('#layer .add-directory').on('click', e => {
        $(e.target).before($('<input type="text" placeholder="Input Dir Name">'));
    })
    //创建layer层
    $('#create-layer').on('click', () => {
        $('#layer .setting').fadeOut();
        $('#layer input').each((index, elem) => {
            const folderName = $(elem).val();
            folders.push(folderName);
            $('<option value="' + folderName + '">' + folderName + '</option>').appendTo($('#new-file select'));
        })
        socket.emit('make-dir', folders);
    })
    //layer右键菜单
    $('#content').on('mousedown', e => {
        $('#right-mousedown').hide().empty();
        if (e.button == 2) {
            currX = e.clientX;
            currY = e.clientY
            $('#right-mousedown').css({ top: currY, left: currX })
                .show().append('<p role="new-file">新建文件</p>');
        }
    })
    //邮件菜单子选项点击事件
    $('#right-mousedown').on('click', 'p', e => {
        const role = $(e.target).attr('role');
        if (role == 'new-file') {
            $('#right-mousedown').hide().empty();
            $('#new-file').css({ top: currY, left: currX }).show();
        }
    })
    //新建文件
    $('#new-file').on('click', 'button', () => {
        const folderName = $('#new-file select').val();
        const fileName = $('#new-file input').val();
        if (folderName && fileName) {
            $('#new-file').hide();
            socket.emit('make-file', { folderName, fileName });
            const box = $('<div class="box">' + fileName + '</div>');
            box.css({top: currY, left: currX});
            box.append($('<span class="input"></span><span class="output"></span>'));
            $('#content').append(box);
        }
    })
})