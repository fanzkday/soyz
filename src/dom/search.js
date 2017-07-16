import { getRelationData } from '../model/relations.js';
var relations;
$(document).on('dblclick', '#svg',(e) => {
    relations = getRelationData().relations;
    $('#search').remove();
    const input = $('<input type="text" id="search"/>');
    input.appendTo($('#content'));
    $('#search').css({ position: 'absolute', top: e.clientY, left: e.clientX });
    $('#search').on('focus', () => {
        $('#select').hide();
    })
    $('#search').on('blur', () => {
        $('#select').show();
        $('#search').remove();
        $('.search').removeClass('search');
    })
    $('#search').focus();
    $('#search').on('keyup', (e) => {
        if (e.keyCode === 13) {
            $('#select').show();
            $('#search').remove();
            $('.search').removeClass('search');
            return;
        }
        $('.search').removeClass('search');
        const text = e.target.value;
        const ids = search(text);
        ids.forEach(id => {
            $(`#${id}`).addClass('search');
        })
    })
})

function search(text) {
    text = text.replace(/^\s*/g, '').replace(/\s*$/, '');
    if (!text) {
        return [];
    }
    const resultIds = [];
    for (var key in relations) {
        if (relations.hasOwnProperty(key)) {
            const elem = relations[key];
            if (key.indexOf(text) !== -1) {
                resultIds.push(elem.id);
            }
        }
    }
    return resultIds;
}
