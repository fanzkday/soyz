
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

/**
 * 求一组坐标x和y的平均值
 * 输入为二维数组[[x,y], ...]
 * @return {x, y}
 */
function centerXY(arr2d) {
    var totalX = 0, totalY = 0;
    arr2d.forEach(item => {
        totalX += item[0];
        totalY += item[1];
    });
    const len = arr2d.length;
    const x = totalX / len;
    const y = totalY / len;
    return { x, y };
}

/**
 * 向外偏移中点的坐标(目前的偏移效果不是很好，暂时弃用该函数)
 * @return 坐标组成的字符串
 */
export function offsetCenter(arr2d) {
    // 复制一份
    const newArr = arr2d.map(item => item);
    // 形心
    const centroid = centerXY(arr2d);
    const len = arr2d.length;
    // newArr长度+1时，index也需要+1，指向正确的插入位置
    var index = 0;
    for (var i = 1; i < len; i++) {
        var A = arr2d[i - 1];
        var B = arr2d[i];

        const lang = Math.sqrt(Math.pow(A[0] - B[0], 2) + Math.pow(A[1] - B[1], 2));
        if (lang >= 120) {
            // AB的中点
            var midpoint = centerXY([A, B]);
            if (midpoint.x >= centroid.x) {
                midpoint.x += 10;
            } else {
                midpoint.x -= 10;
            }
            if (midpoint.y >= centroid.y) {
                midpoint.y += 10;
            } else {
                midpoint.y -= 10;
            }
            newArr.splice(i + index, 0, [midpoint.x, midpoint.y]);
            index += 1;
        }
    }
    var points = '';
    newArr.forEach(item => {
        points += item[0] + ' ' + item[1] + ',';
    })
    return points.slice(0, -1);
}
