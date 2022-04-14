/*
# Author: Ivar Vargas Belizario
# Copyright (c) 2020
# E-mail: ivar@usp.br
*/


function chart_histogram(setToolpiltex, hideToolpiltex, updatelinkList,
                        id, lwidth, colorf, hist) {
    //console.log(coloresi);

    // var interpolate = d3.interpolateRgbBasis(coloresi);
    var n = hist.length;
    var w = lwidth <= 400 ? 400: lwidth;
    var h = 40; 
    var h2 = 15; 

    idview = "#"+id;
    gelem(id).setAttribute("width", w+"px");
    gelem(id).setAttribute("height", (h+h2)+"px");

    // var colores = d3.range(n).map(function(d) {
    //   return interpolate(d/(hist.length -1));
    // });

    var data = Array.from(Array(n).keys());

    var xScale = d3.scaleLinear()
        .domain([0,n-1])
        .range([0, w]);

    d3.select(idview).selectAll("svg").remove();
    var svgmain = d3.select(idview).append("svg")
        .attr("width", w)
        .attr("height", h+h2)
        .attr("transform", "translate(" + 0 + "," + 0 + ")")
        .append("g");
    
    var colorhist = svgmain.append("g").selectAll(".rectclass");
    var linedivclass = svgmain.append("g");

    //colorhist.selectAll(".rectclass").remove();
    colorhist = colorhist.data(data);
    colorhist.exit().remove();
    colorhist = colorhist.enter().append("rect")
        .attr("class", "rectclass")
        .attr("x", (d) => Math.floor(xScale(d)))
        .attr("y", (d) => (h-(h*hist[d]["hi"])))
        .attr("height", (d) => (h*hist[d]["hi"])+h2)
        .attr("width", (d) => {
            //if (d == n-1) {
            //    return 6;
            //}
            return Math.floor(xScale(d+1)) - Math.floor(xScale(d)) + 1;
        })
        .attr("fill", (d) => colorf(d/(hist.length -1)) )
        .on("click",    function(d) {
            updatelinkList(hist[d]["id"],"array");
            //var coords = d3.mouse(this);
            //updatecolorbar2featureselection(h-coords[1]);
            //console.log(coords);    
        })
        .on("mouseover", function(d) {
            setToolpiltex(   d3.event.pageX,
                                    d3.event.pageY,
                                    hist[d]["co"]+" edges"
                                    );
        })
        .on("mouseout", function(d) {
            hideToolpiltex();
        });

    //colorhist.append("title")
    //    .text(function(d) { return hist[d]["co"]+" edges"; });

    //linedivclass.exit().remove();
    linedivclass.selectAll(".linedivclass").remove();
    linedivclass
        .append("rect")
        .attr("class", "linedivclass")
        .attr("x", 0)
        .attr("y", h+0)
        .attr("width", w)
        .attr("height", 2)
        .attr("fill", "#fff")
        //.attr('stroke', 'black')
        //.style("stroke-width", 0.25)
        .attr("transform", "translate(0,0)");

    // linedivclass
    //     .append("rect")
    //     .attr("class", "linedivclass")
    //     .attr("x", 0)
    //     .attr("y", 0)
    //     .attr("width", w)
    //     .attr("height", 1)
    //     .attr("fill", "#999")
    //     //.attr('stroke', 'black')
    //     //.style("stroke-width", 0.25)
    //     .attr("transform", "translate(0,0)");

    linedivclass
        .append("line")          // attach a line
        .attr("class", "linedivclass")
        .style("stroke-dasharray","2,2")//dashed array for line
        .style("stroke", "black")  // colour the line
        .attr("x1", 0)     // x position of the first end of the line
        .attr("y1", 0)      // y position of the first end of the line
        .attr("x2", w)     // x position of the second end of the line
        .attr("y2", 0);   
}

