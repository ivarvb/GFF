/*
# Author: Ivar Vargas Belizario
# Copyright (c) 2020
# E-mail: ivar@usp.br
*/


function chart_circularhist(selft, dataT, idcnt, ww, hh){
    var margin = {top: 30, right: 30, bottom: 30, left: 30},
    width = ww - margin.left - margin.right,
    height = hh - margin.top - margin.bottom,
    innerRadius = 70,
    //alturac = 50,
    outerRadius = (Math.min(width, height) / 2)-30;   // the outerRadius goes from the middle of the SVG area to the border

    // append the svg object
    d3.select(idcnt).selectAll("svg").remove();
    var svg = d3.select(idcnt)
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");

    // var data = [
    //             {"Label":"1sdf","Value":0.1,"color":"#ff0000"},
    //             {"Label":"2sdf","Value":0.3,"color":"#ff0000"},
    //             {"Label":"3sdf","Value":0.51,"color":"#ff0000"},
    //             {"Country":"5sdf","Value":0.81,"color":"#ff0000"},
    //             {"Country":"6sdf","Value":0.71,"color":"#ff00ff"},
    //             {"Country":"7sdf","Value":0.31,"color":"#ffff00"},
    //             {"Country":"8sdf","Value":0.21,"color":"#ffff00"},
    //             {"Country":"9sdf","Value":0.71,"color":"#00ff00"},

    //             ];
    var data = dataT;
//d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum.csv", function(data) {

  // Scales
  var x = d3.scaleBand()
      .range([0, 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
      .align(0)                  // This does nothing
      .domain(data.map(function(d) { return d.label; })); // The domain of the X axis is the list of states.
  var y = d3.scaleRadial()
      .range([innerRadius, outerRadius])   // Domain will be define later.
      .domain([0, outerRadius]); // Domain of Y is from 0 to the max seen in the data

  // Add the bars
  svg.append("g")
    .selectAll("path")
    .data(data)
    .enter()
    .append("path")
      .attr("fill", function(d) { return d['color']; })
      .attr("d", d3.arc()     // imagine your doing a part of a donut plot
          .innerRadius(innerRadius)
          .outerRadius(function(d) { return y(outerRadius*d['scorenorm'])+2; })
          .startAngle(function(d) { return x(d.label); })
          .endAngle(function(d) { return x(d.label) + x.bandwidth(); })
          .padAngle(0.01)
          .padRadius(innerRadius))

    // Add the labels
    svg.append("g")
      .selectAll("g")
      .data(data)
      .enter()
      .append("g")
        .attr("text-anchor", function(d) { return (x(d.label) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
        .attr("transform", function(d) { return "rotate(" + ((x(d.label) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")"+"translate(" + (y(outerRadius*d['scorenorm'])+10) + ",0)"; })
      .append("text")
        .text(function(d){return(selft.datagff.fenames[d.label])})
        .attr("transform", function(d) { return (x(d.label) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
        .style("font-size", "9px")
        .attr("alignment-baseline", "middle")



}

(function(global, factory) {
    typeof exports === "object" && typeof module !== "undefined" ? factory(exports, require("d3-scale")) :
    typeof define === "function" && define.amd ? define(["exports", "d3-scale"], factory) :
    (factory(global.d3 = global.d3 || {}, global.d3));
  }(this, function(exports, d3Scale) {
    'use strict';
  
    function square(x) {
      return x * x;
    }
  
    function radial() {
      var linear = d3Scale.scaleLinear();
  
      function scale(x) {
        return Math.sqrt(linear(x));
      }
  
      scale.domain = function(_) {
        return arguments.length ? (linear.domain(_), scale) : linear.domain();
      };
  
      scale.nice = function(count) {
        return (linear.nice(count), scale);
      };
  
      scale.range = function(_) {
        return arguments.length ? (linear.range(_.map(square)), scale) : linear.range().map(Math.sqrt);
      };
  
      scale.ticks = linear.ticks;
      scale.tickFormat = linear.tickFormat;
  
      return scale;
    }
  
    exports.scaleRadial = radial;
  
    Object.defineProperty(exports, '__esModule', {value: true});
  }));