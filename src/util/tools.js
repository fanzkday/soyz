import * as d3 from 'd3';
import * as $ from 'jquery';
import { addToList } from './storage.js';
import { battery, onlyOutputBattery } from '../components/bat';

//计算bezier曲线点的位置
export function curveTo(x1, y1, x4, y4) {
    x1 = Number(x1);
    y1 = Number(y1);
    x4 = Number(x4);
    y4 = Number(y4);
    var x2, x3;
    if (x1 < x4) {
        x2 = x3 = (x1 + x4) / 2;
    }
    if (x1 >= x4) {
        x2 = x1 + (x1 + x4) / 5;
        x3 = x4 - (x1 + x4) / 5;
    }
    return `M${x1} ${y1} C${x2} ${y1}, ${x3} ${y4}, ${x4} ${y4}`;
}

//生成路径文字
export function pathText(id, texts) {
    // id = outputId + inputId
    const text = d3.select('#svg svg').append('text')
        .attr('id', id)
        .attr('dy', '-5px');
    text.append('textPath')
        .attr('startOffset', '25%')
        .attr('xlink:href', id)
        .text(texts);
    text.append('textPath')
        .style('font-size', '12px')
        .style('fill', 'red')
        .attr('startOffset', '20%')
        .attr('class', 'Cut')
        .attr('xlink:href', id)
        .text('Cut');
}
/**
 * 生成module bat
 */
export function createModuleBat(data) {
    data.devDependencies.forEach(item => {
        const info = addToList(item.id, '', item.name);
        if ($(`#${info.id}`).length === 0) {
            $('#content .module').append(onlyOutputBattery(info));
        }
    })
}
/**
 * 根据数据生成bat
 */
export function reObject(obj) {
    for (var key in obj) {
        if (typeof obj[key] === 'object' && !obj[key].id) {
            reObject(obj[key]);
        }
        if (typeof obj[key] === 'object' && obj[key].id) {
            var info = addToList(obj[key].id, obj[key].dir, key);
            if ($(`#${info.id}`).length === 0) {
                $(battery(info)).css({ top: obj[key].pos.y, left: obj[key].pos.x }).appendTo($('#content'));
            }
        }
    }
}
/**
 * 根据数据生成bat的关系
 */
export function reRelations(obj, dev) {
    for (var key in obj) {
        if (typeof obj[key] === 'object' && !obj[key].id) {
            reRelations(obj[key], dev);
        }
        if (typeof obj[key] === 'object' && obj[key].id) {
            buildRelations(obj[key].input, obj[key].id, dev);
        }
    }
}
function buildRelations(inputs, inputId, dev) {
    inputs.forEach(input => {
        if (Array.isArray(input)) {

        } else if (typeof input === 'string') {
            //引用的为node_modules中的模块
            for (var key in dev) {
                if (dev[key].name === input) {
                    const outputId = dev[key].id;
                    createRelationPath(outputId, inputId);
                }
            }
        }
    })
}

/**
 * outputId, inputId
 */
export function createRelationPath(outputId, inputId) {

    const fromText = $(`#${outputId} p.title`).text();
    const x1 = $(`#${outputId} .output`).offset().left + 6;
    const y1 = $(`#${outputId} .output`).offset().top + 6;

    const toText = $(`#${inputId} p.title`).text();
    const x2 = $(`#${inputId} .input`).offset().left + 6;
    const y2 = $(`#${inputId} .input`).offset().top + 6;

    const path = d3.select('#svg svg').append('path');
    path.attr('output', outputId).attr('start', `${x1},${y1}`);
    const id = outputId + inputId;
    path.attr('input', inputId).attr('end', `${x2},${y2}`).attr('id', id);
    path.attr('d', curveTo(x1, y1, x2, y2));
    console.log(`${fromText} TO ${toText}`);
    pathText(`#${id}`, `${fromText} TO ${toText}`);
}
