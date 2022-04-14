/*
# Author: Ivar Vargas Belizario
# Copyright (c) 2020
# E-mail: ivar@usp.br
*/


function hidewindowinfo() {
    //    gelem('idinfosoundfile').style.display = "none";
    //    mySoundSC.pause();
}



// from https://github.com/substack/point-in-polygon
function pointInPolygon(point, vs) {
    var xi, xj, i, intersect,
        x = point[0],
        y = point[1],
        inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        xi = vs[i][0],
            yi = vs[i][1],
            xj = vs[j][0],
            yj = vs[j][1],
            intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

function polygonToPath(polygon) {
    return ("M" + (polygon.map(function (d) { return d.join(','); }).join('L')));
}



function plotProjection(projectioncolorf, idview, selfgff, argms) {
    var self = this;

    this.projectioncolorf = projectioncolorf;
    //console.log("dat",dat);
    //console.log("argms",argms);

    gelem(argms["infleft"]).innerHTML = "TOTAL: " + selfgff.datagff.layoutinstance.points.length;
    var data = selfgff.datagff.layoutinstance.points;
    var targetsize = Object.keys(selfgff.datagff.layoutinstance.tartegsnames).length;
    
    //var colors = dat.tartegscolors;
    var issel = 1;

    var margin = { top: 0, right: 0, bottom: 0, left: 0 },
        width = selfgff.lwidth,
        height = selfgff.lwidth;

    // setup x
    var xValue = function (d) { return d.x; }, // data -> value
        xScale = d3.scaleLinear().range([0, width]), // value -> display
        xMap = function (d) { return xScale(xValue(d)); }, // data -> display
        //        xAxis = d3.svg.axis().scale(xScale).orient("bottom");
        xAxis = d3.axisBottom(xScale);

    // setup y
    var yValue = function (d) { return d.y; }, // data -> value
        yScale = d3.scaleLinear().range([height, 0]), // value -> display
        yMap = function (d) { return yScale(yValue(d)); }, // data -> display
        yAxis = d3.axisLeft(yScale);


    // don't want dots overlapping axis, so add in buffer to data domain
    xScale.domain([d3.min(data, xValue) - 5, d3.max(data, xValue) + 5]);
    yScale.domain([d3.min(data, yValue) - 5, d3.max(data, yValue) + 5]);


    //console.log("colors", colors);
    //var cValue = function (t) { return colors[t]; };

    /////////////////////////////////////////////////////////    
    /////////////////////////////////////////////////////////    
    /////////////////////////////////////////////////////////    
    /////////////////////////////////////////////////////////    
    this.selected = [];
    this.transform = d3.zoomIdentity;
    //this.coords = [],
    //this.line = d3.line();

    //this.svg;
    //var container;
    //var savedTranslation = [0, 0];
    //var savedScale = 1;

    var lassoPolygon;
    var lassoPath;
    var closePath;

    var drag = d3.drag()
        .on("start", function () {
            lassoPolygon = [d3.mouse(this)];
            if (lassoPath) {
                lassoPath.remove();
            }
            lassoPath = self.svg
                .append('path')
                .attr('fill', '#0bb')
                .attr('fill-opacity', 0.1)
                .attr('stroke', '#0bb')
                .attr('stroke-dasharray', '3, 3');
            closePath = self.svg
                .append('line')
                .attr('x2', lassoPolygon[0][0])
                .attr('y2', lassoPolygon[0][1])
                .attr('stroke', '#0bb')
                .attr('stroke-dasharray', '3, 3')
                .attr('opacity', 0);
        })
        .on("drag", function () {
            var point = d3.mouse(this);
            lassoPolygon.push(point);
            lassoPath.attr('d', polygonToPath(lassoPolygon));
            closePath
                .attr('x1', point[0])
                .attr('y1', point[1])
                .attr('opacity', 1);
        })
        .on("end", function () {
            closePath.remove();
            closePath = null;
            lassoPath.attr('d', polygonToPath(lassoPolygon) + 'Z');
            self.selected = [];
            self.container.selectAll(".dot").each(function (d, i) {
                // var xx = (parseFloat(d3.select(this).attr("cx")) * savedScale) + savedTranslation[0];
                // var yy = (parseFloat(d3.select(this).attr("cy")) * savedScale) + savedTranslation[1];

                var xx = (parseFloat(d3.select(this).attr("cx")) * self.transform.k) + self.transform.x;
                var yy = (parseFloat(d3.select(this).attr("cy")) * self.transform.k) + self.transform.y;

                point = [xx, yy];
                if (pointInPolygon(point, lassoPolygon)) {
                    self.selected.push(d.id);
                }
            });
            self.highlight(this, self.selected);
            gelem(argms["infright"]).innerHTML = " / SELECTED: " + self.selected.length;
            lassoPath.remove();
            lassoPath = null;
            lassoPolygon = null;
        });

    var zoom = d3.zoom()
        .scaleExtent([0.5, 50])
        .on("zoom", function () {
            self.transform = d3.event.transform;
            self.container.attr("transform", self.transform);
        });

    d3.select(idview).selectAll("svg").remove();
    this.svg = d3.select(idview)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .call(drag)
        .call(zoom)
        .append("g");
    //.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    this.container = this.svg.append("g");


    /////////////////////////////////////////////////////////    
    /////////////////////////////////////////////////////////    
    /////////////////////////////////////////////////////////    
    /////////////////////////////////////////////////////////    

    var opxy = 0.5;
    var sizexy = selfgff.instvertexratio;
    var sizebr = 1.75;

    self.nodesc = self.container.append("g").selectAll(".dot");

    self.nodesc = self.nodesc.data(data);
    self.nodesc.exit().remove();
    self.nodesc = self.nodesc.enter().append("circle")
        .attr("class", "dot")
        .attr("r", sizexy)
        .attr("cx", xMap)
        .attr("cy", yMap)
        .style("opacity", selfgff.instvertexoacity)
        .style('stroke', 'white')
        .style('stroke-width', sizebr)
        .style("fill", function (d) {
            return self.projectioncolorf(d.t/(targetsize)); 
            //return d3.color(cValue(d.t)).darker(); 

            })
        .on("mouseover", function (d) {
            //var point = d3.mouse(this);

            //**alter(d);
            //showfloatwind(d.id);
            //console.log("xxxxx");
            selfgff.setToolpiltex(
                d3.event.pageX,
                d3.event.pageY,
                "ID:"+selfgff.idinstancelabel[d.id]+""
                );

        })
        .on("mouseout", function (d) {
            selfgff.hideToolpiltex();
            //hidefloatwind();
            //console.log("xxxxx");
        })
        .merge(self.nodesc);

        /*     
        self.nodesc.append("title")
        .text(function (d) {
            //console.log("d.id", d.id, selfgff.idinstancelabel);
            return "ID: " + selfgff.idinstancelabel[d.id]; 
            
            });
         */

    this.highlight = function (view, ids) {
        d3.select(view).selectAll("circle")
            .attr("r", selfgff.instvertexratio)
            .style("opacity", selfgff.instvertexoacity)
            .style("stroke", "white");

        //var selectionBArray = d3.select(view).selectAll("dot").nodes();
        //var selectionBArray = d3.select(view).selectAll("circle").nodes();
        var selectionBArray = self.svg.selectAll(".dot")["_groups"][0];
        for (var i in ids) {
            cir = selectionBArray[ids[i]];
            cir.style.stroke = d3.color(cir.style.fill).darker();
            //cir.style.stroke = "#94f7f4";
        }
    };

    this.updatesizeandopacity = function () {
        d3.select(idview).selectAll("circle")
        .attr("r", selfgff.instvertexratio)
        .style("opacity", selfgff.instvertexoacity);
    };

    this.updatecolors = function () {
    
        var selectionBArray = self.svg.selectAll(".dot")["_groups"][0];
        //console.log("selectionBArray", selectionBArray);
        
        self.nodesc
        .style("fill", function (d) {
            return self.projectioncolorf(d.t/(targetsize));
        })
        .style("stroke", function (d) {
            return "#fff";
        });

        for (var i in self.selected) {
            cir = selectionBArray[self.selected[i]];
            cir.style.stroke = d3.color(cir.style.fill).darker();
            //cir.style.strokeWidth = 2.25;
            cir.style.opacity = "1.0";
        }

    };

    this.exwholeinstancesprj = function() {
        var txtex = "DY\n"+data.length+"\n2\nx;y\n";
        for (var i in data){
            txtex += selfgff.idinstancelabel[i]+";"+data[i].x+";"+data[i].y+";"+data[i].t+"\n";
        }
        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/txt;charset=utf-8,' + encodeURI(txtex);
        hiddenElement.target = '_blank';
        hiddenElement.download = selfgff.datafileselectedname+'_selected.prj';
        hiddenElement.click();

/*         gelem("idaddhide").appendChild(hiddenElement);
        var olddata=gelem("idaddhide").lastChild;
        gelem("idaddhide").removeChild(olddata); */
    };

    this.exselectedinstancesprj = function() {
        if (self.selected.length>0){        
            var txtex = "DY\n"+self.selected.length+"\n2\nx;y\n";
            for (var i of self.selected){
                txtex += selfgff.idinstancelabel[i]+";"+data[i].x+";"+data[i].y+";"+data[i].t+"\n";
            }
            var hiddenElement = document.createElement('a');
            hiddenElement.href = 'data:text/txt;charset=utf-8,' + encodeURI(txtex);
            hiddenElement.target = '_blank';
            hiddenElement.download = selfgff.datafileselectedname+'_selected.prj';
            hiddenElement.click();

    /*         gelem("idaddhide").appendChild(hiddenElement);
            var olddata=gelem("idaddhide").lastChild;
            gelem("idaddhide").removeChild(olddata); */
        }
    };

    this.exidsinstancesprj = function() {
        if (self.selected.length>0){
            var txtex = "";
            for (var i of self.selected){
                txtex += selfgff.idinstancelabel[i]+"\n";
            }
            var hiddenElement = document.createElement('a');
            hiddenElement.href = 'data:text/txt;charset=utf-8,' + encodeURI(txtex);
            hiddenElement.target = '_blank';
            hiddenElement.download = selfgff.datafileselectedname+'_ids.txt';
            hiddenElement.click();

    /*         gelem("idaddhide").appendChild(hiddenElement);
            var olddata=gelem("idaddhide").lastChild;
            gelem("idaddhide").removeChild(olddata); */
        }
    };

}

