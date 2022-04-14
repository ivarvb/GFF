/*
# Author: Ivar Vargas Belizario
# Copyright (c) 2020
# E-mail: ivar@usp.br
*/


function chart_palettecolors(functionT, id, w, h, colorf) {
    // w = 20;
    // h = 500;
    //console.log(coloresi);
    gelem(id).setAttribute("width", w+"px");
    gelem(id).setAttribute("height", h+"px");

    // var interpolate = d3.interpolateRgbBasis(coloresi);
    var n = 100;

    // var colores = d3.range(n).map(function(d) {
    //   return interpolate(d/(n-1));
    // });

    var data = Array.from(Array(n).keys());

    var xScale = d3.scaleLinear()
        .domain([0,n-1])
        .range([0, h]);

    idview = "#"+id;


    var dragg = d3.drag()
        .on("start", function() {
            
        })
        .on("drag", function() {
            var coords = d3.mouse(this);
            //console.log("coords",coords);
            updatecolorbar2featureselection(d3.event.y);
        })
        .on("end", function () {

        });    



    d3.select("#"+id).selectAll("svg").remove();
    var svgmain = d3.select(idview).append("svg")
        .attr("width", w)
        .attr("height", h)
        .call(dragg)
        .on("click",    function() {
            var coords = d3.mouse(this);
            updatecolorbar2featureselection(coords[1]);
            //console.log(coords);    
        })
        .attr("transform", "translate(" + 0 + "," + 0 + ")")
        .append("g");

    var palette = svgmain.append("g").selectAll(".rectclass");
    var bars = svgmain.append("g");

    palette = palette.data(data);
    palette.exit().remove();
    palette = palette.enter().append("rect")
        .attr("class", "rectclass")
        .attr("x", 0)
        .attr("y", (d) => Math.floor(xScale(d)))
        .attr("width", w)
        .attr("height", (d) => {
            if (d == n-1) {
                return 6;
            }
            return Math.floor(xScale(d+1)) - Math.floor(xScale(d)) + 1;
        })
//        .attr("fill", (d) => cScale(d));
        .attr("fill", (d) => colorf(1-(d/(n-1))));
        //.attr("transform", "translate("+w+","+h+") rotate(180)");



    bars.selectAll(".splitermove").remove();
    bars
        .append("rect")
        .attr("class", "splitermove")
        .attr("x", 0)
        .attr("y", h-10)
        .attr("width", w)
        .attr("height", 10)
        .attr("fill", "#999")
        .attr('stroke', 'black')
        .style("stroke-width", 0.25);

    function updatecolorbar2featureselection(y1){
        if(y1<10) y1=10;

        if(y1>=(h)) y1=(h);

        T = ((h-10)-(y1-10))/((h-10));

        //layout.layoutfeatures.T1 = T;
        functionT(T);
        //layout.layoutfeatures.selectbythreshold();
        //console.log("y1",y1, (h-10));

        bars.attr("transform", "translate(0, "+(y1-h)+")");
        //bars.attr("y", y1);
    }
}

