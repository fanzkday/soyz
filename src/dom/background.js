
const svg = d3.select('#svg svg');
const interval = 35;
const count = Math.ceil(3000 / interval);
for (var i = 0; i < count; i++) {
    const xline = svg.append('line')
        .attr('x1', interval * (i + 1))
        .attr('y1', 0)
        .attr('x2', interval * (i + 1))
        .attr('y2', 3000);
    const yline = svg.append('line')
        .attr('x1', 0)
        .attr('y1', interval * (i + 1))
        .attr('x2', 3000)
        .attr('y2', interval * (i + 1))
    if (i % 5 === 0) {
        xline.style('stroke', '#999');
        yline.style('stroke', '#999');
    }
}