/*
# Author: Ivar Vargas Belizario
# Copyright (c) 2020
# E-mail: ivar@usp.br
*/

function chart_correlation(idview, data, featuresels, target){
    // Dimension of the whole chart. Only one size since it has to be square
    var marginWhole = {top: 10, right: 10, bottom: 10, left: 10},
//    var marginWhole = {top: 0, right: 0, bottom: 0, left: 0},
        sizeWhole = 800 - marginWhole.left - marginWhole.right,
        scale = 1.0,
        transform = d3.zoomIdentity;


    var zoom = d3.zoom()
        .scaleExtent([0, 8])
        .on("zoom", zoomed);
    function zoomed() {
        scale = d3.event.transform.k;
        transform = d3.event.transform;
        svg.attr("transform", transform);
    }

    var drag = d3.drag()
        .on("start", function() {

        })
        .on("drag", function(d) {
            transform.x = ((d3.event.x))-(sizeWhole*scale)/2;
            transform.y = ((d3.event.y))-(sizeWhole*scale)/2;
            //console.log("7777777", transform);
            svg.attr("transform", transform);
        })
        .on("end", function () {

        });        

    // Create the svg area
    d3.select(idview).selectAll("svg").remove();
    var svg = d3.select(idview).append("svg")
        .attr("width", sizeWhole  + marginWhole.left + marginWhole.right)
        .attr("height", sizeWhole  + marginWhole.top + marginWhole.bottom)
        .call(drag)
        .call(zoom)
        .attr("transform", "translate(" + marginWhole.left + "," + marginWhole.top + ")")
        .style("font-size","25px")
        .style("pointer-events", "all")
        .append("g");

//    d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv", function(data) {

      // What are the numeric variables in this dataset? How many do I have
      var allVar = [];
      for (var k in featuresels){
        allVar.push(k);
      }
      var numVar = allVar.length;

      // Now I can compute the size of a single chart
      //mar = 0
      mar = 0;
      size = sizeWhole / numVar;


      // ----------------- //
      // Scales
      // ----------------- //

      // Create a scale: gives the position of each pair each variable
      var position = d3.scalePoint()
        .domain(allVar)
        .range([0, sizeWhole-size]);



      // Color scale: give me a specie name, I return a color
      var catkey = {};
      var catval = [];
      for (i = 0; i<data.length;++i){
        catkey[data[i][target]] = 1;
      }
      for (key in catkey){
        catval.push(key);
      }
      var color = d3.scaleOrdinal()
        .domain(catval)
        .range(["#1b70fc", "#faff16", "#d50527", "#158940", "#f898fd", "#24c9d7", "#cb9b64", "#866888", "#22e67a", "#e509ae", "#9dabfa", "#437e8a", "#b21bff", "#ff7b91", "#94aa05", "#ac5906", "#82a68d", "#fe6616", "#7a7352", "#f9bc0f", "#b65d66", "#07a2e6", "#c091ae", "#8a91a7", "#88fc07", "#ea42fe", "#9e8010", "#10b437", "#c281fe", "#f92b75", "#07c99d", "#a946aa", "#bfd544", "#16977e", "#ff6ac8", "#a88178", "#5776a9", "#678007", "#fa9316", "#85c070", "#6aa2a9", "#989e5d", "#fe9169", "#cd714a", "#6ed014", "#c5639c", "#c23271", "#698ffc", "#678275", "#c5a121", "#a978ba", "#ee534e", "#d24506", "#59c3fa", "#ca7b0a", "#6f7385", "#9a634a", "#48aa6f", "#ad9ad0", "#d7908c", "#6a8a53", "#8c46fc", "#8f5ab8", "#fd1105", "#7ea7cf", "#d77cd1", "#a9804b", "#0688b4", "#6a9f3e", "#ee8fba", "#a67389", "#9e8cfe", "#bd443c", "#6d63ff", "#d110d5", "#798cc3", "#df5f83", "#b1b853", "#bb59d8", "#1d960c", "#867ba8", "#18acc9", "#25b3a7", "#f3db1d", "#938c6d", "#936a24", "#a964fb", "#92e460", "#a05787", "#9c87a0", "#20c773", "#8b696d", "#78762d", "#e154c6", "#40835f", "#d73656", "#1afd5c", "#c4f546", "#3d88d8", "#bd3896", "#1397a3", "#f940a5", "#66aeff", "#d097e7", "#fe6ef9", "#d86507", "#8b900a", "#d47270", "#e8ac48", "#cf7c97", "#cebb11", "#718a90", "#e78139", "#ff7463", "#bea1fd"]);



      //var interpolate = d3.interpolateRgbBasis(["green", "yellow", "darkgreen", "blue", "red"]);
      //var n = 9;
      //var color = d3.range(n).map(function(d) {
      //  return interpolate(d/(n-1));
      //});


      // ------------------------------- //
      // Add charts
      // ------------------------------- //
      for (i in allVar){
        for (j in allVar){

          // Get current variable name
          var var1 = allVar[i]
          var var2 = allVar[j]

          // If var1 == var2 i'm on the diagonal, I skip that
          if (var1 === var2) { continue; }

          var mmmar = 10;
          //console.log("qqqq15", mmmar);

          // Add X Scale of each graph
          xextent = d3.extent(data, function(d) { return +d[var1] })
          var x = d3.scaleLinear()
            .domain(xextent).nice()
            .range([ mmmar, size-mmmar ]);

          // Add Y Scale of each graph
          yextent = d3.extent(data, function(d) { return +d[var2] })
          var y = d3.scaleLinear()
            .domain(yextent).nice()
            .range([ size-mmmar, mmmar ]);

          // Add a 'g' at the right position
          var tmp = svg
            .append('g')
            .attr("transform", "translate(" + (position(var1)+mar) + "," + (position(var2)+mar) + ")")
            .style("font-size","5px");

            tmp.append("rect")
//                .attr("width", size-((marginWhole.top/2)+1) )
//                .attr("height", size-((marginWhole.top/2)+1) )
                .attr("width", size )
                .attr("height", size )
                .style("fill", "none")
                .style("stroke", "#555")
                .style("stroke-width", 1)
                .style("pointer-events", "all");

//          // Add X and Y axis in tmp
//          tmp.append("g")
//            .attr("transform", "translate(" + 0 + "," + (size-mar*2) + ")")
//            .style("font-size","5px")
//            .call(d3.axisBottom(x).ticks(3));
//          tmp.append("g")
//            .style("font-size","5px")
//            .call(d3.axisLeft(y).ticks(3));

          // Add circle
          tmp
            .selectAll("pointsplot")
            .data(data)
            .enter()
            .append("circle")
              .attr("cx", function(d){ return x(+d[var1]) })
              .attr("cy", function(d){ return y(+d[var2]) })
              .attr("r", 2)
              .attr("fill", function(d){ return color(d[target])})
              .attr('opacity', 0.8);
        }
      }


      // ------------------------------- //
      // Add variable names = diagonal
      // ------------------------------- //
      for (i in allVar){
        for (j in allVar){
          // If var1 == var2 i'm on the diagonal, otherwisee I skip
          if (i != j) { continue; }
          // Add text
          var var1 = allVar[i]
          var var2 = allVar[j]
          svg
            .append('g')
            .attr("transform", "translate(" + position(var1) + "," + position(var2) + ")")
            .append('text')
              .attr("x", size/2)
              .attr("y", size/2)
              .text(var1)
              .attr("text-anchor", "middle")
              .style("font-size","10px");
          svg
            .append('g')
            .attr("transform", "translate(" + position(var1) + "," + position(var2) + ")")
            .append("rect")
                .attr("width", size )
                .attr("height", size )
                .style("fill", "none")
                .style("stroke", "#555")
                .style("stroke-width", 1);
                //.style("pointer-events", "all");
              ;
        }
      }
//    });
}

