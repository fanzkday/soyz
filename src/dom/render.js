import * as d3 from 'd3';
import * as $ from 'jquery';
import { battery, onlyOutputBattery } from '../components/bat';
import { getRelationData } from '../model/relations.js';
import { addToList } from '../model/batList.js';
import { randomPos, curveTo } from '../util/tools.js';

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
export function createBats(obj, posArr) {
    for (var key in obj) {
        const o = obj[key];
        for (var name in o) {
            var element = o[name];
            if (element.hasOwnProperty('id')) {
                const info = {
                    id: element.id,
                    dir: key,
                    name: name
                }
                if ($(`#${info.id}`).length === 0) {
                    const x = element.pos.x ? element.pos.x : randomPos().x;
                    const y = element.pos.y ? element.pos.y : randomPos().y;
                    $(battery(info)).css({ top: y, left: x }).appendTo($('#content'));
                    posArr.push({ batteryId: element.id, currX: x, currY: y });
                }
            }
        }
    }
}

/**
 * 根据数据生成bat的关系
 */
export function createRelations(data) {
    const relations = data.relations;
    const dev = data.devDependencies;
    for (var key in relations) {
        const o = relations[key];
        for (var name in o) {
            var element = o[name];
            if (element.hasOwnProperty('id')) {
                _buildRelations(element, dev);
            }
        }
    }
}
function _buildRelations(element, dev) {
    const inputs = element.input;
    const inputId = element.id;

    inputs.forEach(input => {
        if (Array.isArray(input)) {
            _fileToFileRelation(input, inputId);
        } else if (typeof input === 'string') {
            _moduleToFileRelation(dev, input, inputId);
        }
    })
}
function _moduleToFileRelation(dev, input, inputId) {
    //引用的为node_modules中的模块
    dev.forEach(item => {
        if (item.name === input) {
            const outputId = item.id;
            createRelationPath(outputId, inputId);
        }
    })
}
function _fileToFileRelation(input, inputId) {
    const relations = getRelationData().relations;

    const name = input[input.length - 1];
    input.pop();
    const dir = input.join('/');
    const o = relations[dir][name];
    createRelationPath(o.id, inputId);
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
    pathText(`#${id}`, `${fromText} to ${toText}`);
}

//生成路径文字
export function pathText(id, texts) {
    // id = outputId + inputId
    const text = d3.select('#svg svg').append('text')
        .attr('id', id)
        .attr('dy', '-5px')
        .style('display', 'none');
    text.append('textPath')
        .attr('startOffset', '45%')
        .attr('xlink:href', id)
        .text(texts);
    text.append('textPath')
        .style('fill', 'red')
        .attr('startOffset', '40%')
        .attr('class', 'Cut')
        .attr('xlink:href', id)
        .text('X');
}
