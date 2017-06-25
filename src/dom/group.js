import * as $ from 'jquery';
import * as d3 from 'd3';
$(document).on('mousedown', e => {
    const startX = e.clientX;
    const startY = e.clientY;
    const rect = d3.select('#group svg').append('rect');
    rect.attr('x', startX).attr('y', startY);
    $(document).on('mousemove', e => {
        const endX = e.clientX;
        const endY = e.clientY;
        renderRect(rect, startX, startY, endX, endY);
    })
    $(document).on('mouseup', () => {
        $(document).off('mousemove');
        rect.remove();
    })
})

function renderRect(rect, startX, startY, endX, endY) {
    const width = endX - startX;
    const height = endY - startY;
    if (endX > startX) {
        rect.attr('x', startX).attr('width', width);
    } else {
        rect.attr('x', endX).attr('width', -width);
    }
    if (endY > startY) {
        rect.attr('y', startY).attr('height', height);
    } else {
        rect.attr('y', endY).attr('height', -height);
    }
}