/*
# Author: Ivar Vargas Belizario
# Copyright (c) 2020
# E-mail: ivar@usp.br
*/

/* Adapted from: https://github.com/upphiminn/d3.ForceBundle
 */
function chart_circularbundle(idview,datai,diameteri){
    var self = this;
    self.data = datai;

    self.diameter = diameteri,
        self.radius = self.diameter / 2;
//    var perimeter = (2*Math.PI*radius);
//    var r = Math.floor((perimeter/datai.nodes.children.length)/5);
    self.r = 3;
    
    self.color = d3.scaleOrdinal(d3.schemeCategory10);
//    var instances = datai.nodes;
//    var arestas = datai.edges;

    d3.select(idview).selectAll("svg").remove();
    self.svg = d3.select(idview)
        .append("svg")
        .attr("width", self.diameter)
        .attr("height", self.diameter)
        .append("g")
        .attr("transform", "translate(" + self.radius + "," + self.radius + ")");
    self.link = self.svg.append("g").selectAll(".link");
    self.node = self.svg.append("g").selectAll(".node");


    self.line = d3.radialLine()
        .curve(d3.curveBundle.beta(0.85))
        .radius(function (d) {
            return d.y;
        })
        .angle(function (d) {
            return d.x / 180 * Math.PI;
        });
        
//    self.line = d3.line()
//      .x(xAccessor)
//      .y(yAccessor)
//      .curve(d3.curveBundle.beta(0.7));


    self.cluster = d3.cluster()
//        .size([360, (diameter/2) - 100]);
        .size([360, (self.diameter/2) - (2*self.r+5 )]);
//        .size([360, (diameter/2) - (2*r+5 )]);


    
    self.nodes = self.cluster(d3.hierarchy({name: "",children:self.data.graph.nodes})).leaves();
    console.log("XXXXXXX",self.nodes);
    self.links = mapx(self.nodes, self.data.graph.links);

    self.drawedges = function(){
        self.link = self.link
            .data(self.links)
            .enter()
            .append("path")
            .attr("class", "link")
            .attr("d", self.line);
    };
    self.drawedges();

    self.drawnodes = function(){
        self.node = self.node
            .data(self.nodes.filter(function (d) {
                return !d.children;
            }));
            
        self.node.exit().remove();
                
        self.node = self.node
            .enter()
            .append("g")
            .attr("class", "node")
            .attr("transform", function (d) {
                return "rotate(" + (d.x - 90) + ")translate(" + (d.y+self.r+2) + ")"
                + "rotate(" + (90 - d.x) + ")";
            })
            .on("mouseover", mouseoveredx)
            .on("mouseout", mouseoutedx);

        self.node.append("circle")
            .attr("r", self.r)
            .style("fill", function (d, i) {
//                return self.color(i);
                return d.data.color;
            });

        self.node.append("title")
            .text(function(d) { return d.data.label; });

    //    node.append('text')
    //        .attr('dy', '0.32em')
    //        .attr('x', function (d) { return d.x < 180 ? (r+2) : -1*(r+2); })
    //        .style('text-anchor', function (d) { return d.x < 180 ? 'start' : 'end'; })
    //        .attr('transform', function (d) { return 'rotate(' + (d.x < 180 ? d.x - 90 : d.x + 90) + ')'; })
    //        .text(function (d) { return d.data.name+"ABCXXXX1245678"; });
    };
    self.drawnodes();        


    function mouseoveredx(d){
        self.link
          .style('stroke-opacity', function (link_d) {
            return link_d[0] === d | link_d[link_d.length - 1] === d ? 1 : null;
          })
          .style('stroke', function (link_d) {
            return link_d[0] === d | link_d[link_d.length - 1] === d ? '#d62333' : null;
          });
    };
    function mouseoutedx(d){
        self.link
            .style('stroke-opacity', null)
            .style('stroke', null);    
    };
    

    function mapx(nodes, links) {
        var hash = [];
        for (var i = 0; i < nodes.length; i++) {
            hash[nodes[i].data.name] = nodes[i];
        }
        var resultLinks = [];
        for (var i = 0; i < links.length; i++) {
            //d3 v4后用node.path(target)来计算两个点的距离
            //返回一个从node->parent->target的数组路径
            resultLinks.push(hash[links[i].source].path(hash[links[i].target]));
        }
        return resultLinks;
    };


    function xAccessor (d) {
        var angle = (d.x - 90) / 180 * Math.PI, radius = d.y;
        return radius * Math.cos(angle);
    }

    function yAccessor (d) {
        var angle = (d.x - 90) / 180 * Math.PI, radius = d.y;
        return radius * Math.sin(angle);
    }
}