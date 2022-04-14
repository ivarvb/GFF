/*
# Author: Ivar Vargas Belizario
# Copyright (c) 2020
# E-mail: ivar@usp.br
*/


function layout_radial(vDataX, size){
  vDataX[0]['parentId'] = null;
  var vWidth = size;
  var vHeight = size;

  // Prepare our physical space
//   var g = d3.select('svg').attr('width', vWidth).attr('height', vHeight)
// //    .select('g').attr('transform', 'translate(' + vWidth / 2 + ',' + vHeight / 2 + ')');
//   .select('g').attr('transform', 'translate(0,0)');

  // console.log("vNodes000000000000000",vDataX);
  var vMargin = 60;
  var vData = d3.stratify()(vDataX);
  var vLayout = d3.cluster().size([2 * Math.PI, Math.min(vWidth, vHeight) / 2 - vMargin]); // margin!

  // Layout + Data
  var vRoot = d3.hierarchy(vData);
  var vNodes = vRoot.descendants();
  vLayout(vRoot);
  //var vLinks = ll.links();
  // console.log("vNodes!!!!!!!!!!!!!!!!!1",vNodes);
  var RE = new Array(vDataX.length);
  for (var i in vDataX){
      var xy = d3.pointRadial(vNodes[i].x, vNodes[i].y);

      // x = xy[0];
      // y = xy[1];
      x = xy[0] + (vWidth / 2);
      y = xy[1] + (vHeight / 2);
      RE[vDataX[i].id] = {"x":x,"y":y};
      vDataX[i]["x"] = x;
      vDataX[i]["y"] = y;
  }
  return RE
  // for (var i in vDataX){

  // }
  
  // ///Draw on screen
  // g.selectAll('path').data(vLinks).enter().append('path')
  //     .attr('d', d3.linkRadial()
  //         .angle(function (d) { return d.x; })
  //         .radius(function (d) { return d.y; }));



  // g.selectAll('circle').data(vDataX).enter().append('circle')
  //     .attr("class", "node")
  //     .attr('r', 2)
  //     .attr('cx', function (d, i) {
  //         return vDataX[i].x;
  //     })
  //     .attr('cy', function (d, i) {
  //         return vDataX[i].y;
  //     });



  // .attr("transform", function (d) { return "translate(" + d3.pointRadial(d.x, d.y) + ")"; })
  // .on("mouseover", function(d) {
  //     console.log("hola"+d.id+" "+d.x+" "+d.y);
  // })
  // .on("mouseout", function(d) {
  //     console.log("hola out"+d.id+" "+d.x+" "+d.y, d);
  // });



  // console.log("gg", g.selectAll('circle'));
  // g.selectAll(".node").each(function (d, i) {
  //     console.log("out xx yy", this);
  // });

  // var selectionBArray = g.selectAll("circle")["_groups"][0];
  // console.log("selectionBArray", selectionBArray[0]);
}
