import { getRelationData } from '../../model/relations.js';

export function battery(info) {
    var path = (info.dir === '/') ? '/Entry' : info.dir;
    const className = (info.dir === '/') ? 'entry' : '';
    
    const dirList = getRelationData().dirList;

    var colorClass = '';
    dirList && dirList.forEach((dir, index) => {
        if (info.dir === dir) {
            colorClass = `_${index}color`;
        }
    });

    return (
        `<div class="battery ${className} ${colorClass}" id="${info.id}">
            <div>${path}/</div>
            <p class="title" title="${info.name}">${info.name}</p>
            <span class="input"></span>
            <span class="output"></span>
        </div>`
    )
}

export function onlyOutputBattery(info) {
    return (
        `<div class="battery only_output" id="${info.id}">
            <p class="title" title="${info.name}">${info.name}</p>
            <span class="output"></span>
        </div>`
    )
}