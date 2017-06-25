
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

/**
 * 生成随机的坐标
 */
export function randomPos() {
    return {
        x: Math.ceil(Math.random() * 600) + 50,
        y: Math.ceil(Math.random() * 600)
    }
}
