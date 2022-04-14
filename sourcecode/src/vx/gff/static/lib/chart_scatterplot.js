/*
# Author: Ivar Vargas Belizario
# Copyright (c) 2020
# E-mail: ivar@usp.br
*/


function chart_scatterplot(idview, widthi, heighti, data, atri1, atri2){

  // change string (from CSV) into number format
//  data.forEach(function(d) {
//    d[atri1] = +d[atri1];
//    d[atri2] = +d[atri2];
//  });
  
//    self.width = widthi;
//    self.height = heighti;

    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 10, bottom: 10, left: 10},
        width = widthi - margin.left - margin.right,
        height = heighti - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select(idview)
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");
//              "translate(" + 100 + "," + 100 + ")");

    svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("stroke", "green")
        .style("stroke-width", 1)
        .style("pointer-events", "all");

    // setup x
    var xValue = function(d) { return d[atri1];}, // data -> value
        xScale = d3.scaleLinear().range([0, width]), // value -> display
        xMap = function(d) { return xScale(xValue(d));}; // data -> display
    // setup y
    var yValue = function(d) { return d[atri2];}, // data -> value
        yScale = d3.scaleLinear().range([height, 0]), // value -> display
        yMap = function(d) { return yScale(yValue(d));}; // data -> display


    xAxis = d3.axisBottom(xScale);
    yAxis = d3.axisLeft(yScale);

    xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
    yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

    //Read the data
//    d3.csv("https://localhost/data/?fidl2_TwoNum.csv", function(data) {

//attr150,Category
      // Add X axis
//      var x = d3.scaleLinear()
//        .domain([0, d3.max(data, d => d.attr150) ])
//        .range([ 0, width ]);
//      svg.append("g")
//        .attr("transform", "translate(0," + height + ")")
//        .call(d3.axisBottom(x));
//
//      // Add Y axis
//      var y = d3.scaleLinear()
//        .domain([0, d3.max(data, d => d.Category)])
//        .range([ height, 0]);
//      svg.append("g")
//        .call(d3.axisLeft(y));


      console.log("ux1331QQQx271MQAXXdatadatadata",data);
      // Add dots
      svg.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", xMap )
        .attr("cy", yMap )
        .attr("r", 2.5)
        .style("fill", "#69b3a2");



    svg.append("g")
        .append("text")             
        .attr("transform",
              "translate(" + (width/2) + " ," + 
                             (height + 10) + ")")
        .attr("x",0)
        .attr("y",0)
        .style("text-anchor", "middle")
        .text(atri1);


    svg.append("g")
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text(atri2);  
      

//    })



}

