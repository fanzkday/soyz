
export function battery(info) {
    const path = info.dir === 'entry' ? `entry&${info.name}` : `${info.dir}/${info.name}`;
    const className = info.dir === 'entry' ? 'entry' : '';
    return (
        `<div class="battery ${className}" id="${info.id}">
            <p class="title" title="${path}">${path}</p>
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