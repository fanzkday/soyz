import { battery, onlyOutputBattery } from '../bat/index.js';
import { getRelationData } from '../model/relations.js';
import { randomPos, curveTo } from '../util/tools.js';

/**
 * 生成module bat
 */
export function createModuleBat(data) {
    data.dependencies.forEach(item => {
        const info = {
            id: item.id,
            dir: '',
            name: item.name
        }
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
        const element = obj[key];
        if (typeof element === 'object') {
            const info = {
                id: element.id,
                dir: element.dir,
                name: element.name,
                path: key
            }
            if ($(`#${info.id}`).length === 0) {
                if (!element.pos.x) {
                    element.pos.x = randomPos(element.dir).x;
                }
                if (!element.pos.y) {
                    element.pos.y = randomPos(element.dir).y;
                }
                const x = element.pos.x;
                const y = element.pos.y;
                $(battery(info)).css({ top: y, left: x }).appendTo($('#content'));
                posArr.push({ batteryId: element.id, currX: x, currY: y });
            }
        }
    }
}

/**
 * 根据数据生成bat的关系
 */
export function createRelations(data) {
    const relations = data.relations;
    const dev = data.dependencies;
    for (var key in relations) {
        const element = relations[key];
        if (typeof element === 'object') {
            _buildRelations(element, dev);
        }
    }
}
function _buildRelations(element, dev) {
    const inputs = element.input;
    const inputId = element.id;

    inputs.forEach(input => {
        if (typeof input === 'string') {
            //引用的为node_modules中的模块
            dev.forEach(item => {
                if (item.name === input) {
                    const outputId = item.id;
                    createRelationPath(outputId, inputId);
                }
            })
            //
            const relations = getRelationData().relations;
            for (var key in relations) {
                if (key === input) {
                    const outputId = relations[key].id;
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
        .attr('startOffset', '35%')
        .attr('xlink:href', id)
        .text(texts);
}
