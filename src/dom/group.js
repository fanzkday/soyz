import * as $ from 'jquery';
import * as d3 from 'd3';
import { offsetCenter } from '../util/tools.js';

setTimeout(function () {
    d3.select('#svg svg').append('polygon').attr('points', points1);
}, 1000);
