import { getRelationData } from '../model/relations.js';

export function battery(info) {
    var path = !info.dir ? '/entry' : info.path.split('/').slice(0, -1).join('/');
    const className = !info.dir ? 'entry' : '';
    
    const dirList = getRelationData().dirList;

    var colorClass = '';
    dirList && dirList.forEach((dir, index) => {
        if (info.dir === dir) {
            colorClass = `color${index}`;
        }
    });

    return (
        `<div class="battery ${className} ${colorClass}" id="${info.id}">
            <div>${path}</div>
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

export function inputContentMenu(data) {
    data = data || [];
    const html = '<ul class="menu">';
    const content = data.map(item => {
        return (
            `<li>${item}</li>`
        );
    }).join('');
    return html + content + '</ul>';
}


