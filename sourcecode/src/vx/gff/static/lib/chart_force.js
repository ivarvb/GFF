/*
# Author: Ivar Vargas Belizario
# Copyright (c) 2020
# E-mail: ivar@usp.br
*/


/* Adapted from: https://github.com/upphiminn/d3.ForceBundle
 */
function chart_force(vertexcolorf, edgecolorf, selft, idview, foncebi, argmsi) {
    var self = this;

    self.vertexcolorf = vertexcolorf;
    self.edgecolorf = edgecolorf;
    self.width = selft.lwidth;
    self.height = selft.lwidth;
    self.graph = selft.datagff.layoutfeature["graph"];
    self.ranking = selft.datagff.layoutfeature["ranking"];
    self.treehi = selft.datagff.layoutfeature["treehi"];
    self.graph["linkupdate"] = [];
    self.graph["linkupdate"] = self.graph.links.slice();
    self.graphmx = selft.datagff.layoutfeature["maxvalue"];
    self.graphmi = selft.datagff.layoutfeature["minvalue"];
    self.initv = selft.datagff.layoutfeature["initvertex1"];
    self.initv2 = selft.datagff.layoutfeature["initvertex2"];
    self.argms = argmsi;
    //    self.isplay = true;
    self.isplay = false;
    self.selectedIndexes = [];
    self.T1 = 0.0;
    //self.ispresskey = 0;
    self.sizecircleper = 0;
    self.sizecirclemax = 8;
    self.transform = d3.zoomIdentity;

    self.isupdatebundling = true;
    self.isshowedgesshift = true;
    self.iscoloslider = true;

    gelem(self.argms["infleft"]).innerHTML = "TOTAL: " + self.ranking.length;

    var R = Math.sqrt(self.graph.nodes.length / Math.PI);
    self.fonceb = foncebi;
    self.ratio = 3;

    self.radiallayout = layout_radial(self.treehi, self.width);
    self.isradiallayout = true;

    self.simulation = d3.forceSimulation()
        .velocityDecay(0.1)
        .alphaTarget(0.1)
        .force("center", d3.forceCenter(0, 0));

    self.simulation
        .force(d3.forceLink());

    var lassoPolygon;
    var lassoPath;
    var closePath;
    self.drag = d3.drag()
        .on("start", function () {
            self.stopforce();

            lassoPolygon = [d3.mouse(this)];
            if (lassoPath) {
                lassoPath.remove();
            }
            lassoPath = self.svgw
                .append('path')
                .attr('fill', '#ff4e00')
                .attr('fill-opacity', 0.1)
                .attr('stroke', '#912c00')
                .attr('stroke-dasharray', '3, 3');

            closePath = self.svgw
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
            var auxfeatureselected = [];
            var auxfeatureselected_vis = Array(self.graph.nodes.length).fill(0);
            if (selft.ispresskey == 1 || selft.ispresskey == 2) {
                for (var i in selft.featureselected) {
                    var e = selft.featureselected[i];
                    auxfeatureselected_vis[e] = 1;
                }
            }
            else {
                selft.featureselected = [];
            }
            var taindex = selft.auxfeatureselectedf[selft.target];


            self.svgw.selectAll(".node").each(function (d, i) {
                var xx = (parseFloat(d3.select(this).attr("cx")) * self.transform.k) + self.transform.x;
                var yy = (parseFloat(d3.select(this).attr("cy")) * self.transform.k) + self.transform.y;

                point = [xx, yy];
                if (pointInPolygon(point, lassoPolygon)) {
                    if (d.category == 0 && d.name != taindex) {
                        auxfeatureselected.push(d.name);
                    }
                }
            });
            // control key
            if (selft.ispresskey == 1) {
                for (var i in auxfeatureselected) {
                    var e = auxfeatureselected[i];
                    var ev = auxfeatureselected_vis[e];
                    if (ev == 0) {
                        selft.featureselected.push(e);
                    }
                }
            }
            // shift key
            else if (selft.ispresskey == 2) {
                var aux2featureselected = [];
                for (var i in auxfeatureselected) {
                    var e = auxfeatureselected[i];
                    auxfeatureselected_vis[e] = 2;
                }
                for (var i in selft.featureselected) {
                    var e = selft.featureselected[i];
                    if (auxfeatureselected_vis[e] != 2) {
                        aux2featureselected.push(e);
                    }
                }
                selft.featureselected = aux2featureselected;
            }
            else {
                selft.featureselected = auxfeatureselected;
            }

            if (selft.intarget && auxfeatureselected_vis[taindex] == 0 && selft.featureselected.length > 0) {
                selft.featureselected.push(taindex);
            }
            self.highlightforce(selft.featureselected);
            lassoPath.remove();
            lassoPath = null;
            lassoPolygon = null;

            //console.log("graggggggggggg.. featureselected",selft.featureselected);
        });


    self.zoom = d3.zoom()
        .scaleExtent([0.5, 15])
        .on("zoom", zoomed);

    function zoomed() {
        self.transform = d3.event.transform;
        self.container.attr("transform", self.transform);
    }



    //    self.svgw.call(drag);
    ///////////////////////////////////////////
    ///////////////////////////////////////////
    ///////////////////////////////////////////



    d3.select(idview).selectAll("svg").remove();
    self.svgw = d3.select(idview).append("svg")
        .attr("width", self.width)
        .attr("height", self.height)
        .call(self.drag)
        .call(self.zoom)
        .append("g");

    self.container = self.svgw.append("g")

    // elements for data join
    self.link = self.container.append("g").selectAll(".link");
    self.link2 = self.container.append("g").selectAll(".links");
    self.links = self.container.append("g").attr("class", "links");
    self.node = self.container.append("g").selectAll(".node");

    self.d3line = d3.line()
        .x(function (d) { return d.x; })
        .y(function (d) { return d.y; });


    self.showedges = function () {
        self.isshowedgesshift = true;
        self.iscoloslider = true;

        self.viewlayoutgraphtree_normal();

        self.link2.style("stroke-opacity", 0.0);
    };

    //draw nodes
    this.drawnodes = function () {
        self.node = self.node.data(self.graph.nodes);
        self.node.exit().remove();
        self.node = self.node.enter().append("circle")
            .attr("class", "node")
            .attr("r", function (d) {
                return (d.category == 1) ? 1.75 : ((d.weight * (self.ratio)) + 3) + (self.sizecirclemax * self.sizecircleper);
            })
            .style('stroke', 'white')
            .style('stroke-width', function (d) {
                return (d.category == 1) ? 0 : 0.75;
            })
            .style("fill", function (d) {
                return (d.category == 1) ? '#ccc' : self.vertexcolorf(d.weight);
            })
            .call(d3.drag()
                .on("start", function (d, i) {
                    self.showedges();
                })
                .on("drag", function (d, i) {
                    self.isupdatebundling = true;
                    d.px += d3.event.dx;
                    d.py += d3.event.dy;
                    d.x += d3.event.dx;
                    d.y += d3.event.dy;
                    self.tick();
                })
                .on("end", function (d, i) {
                    d.fixed = true;
                    self.tick();
                })
            )
            .on("mouseover", function (d) {
                mouseoveredx(d);

                if (d.category == 1){
                    selft.setToolpiltex(
                        d3.event.pageX,
                        d3.event.pageY,
                        "extra" 
                        );
                }
                else{
                    selft.setToolpiltex(
                        d3.event.pageX,
                        d3.event.pageY,
                        selft.datagff.fenames[d.label] + ":" + self.ranking[d.name]
                        );
                }

            })
            .on("mouseout", function (d) {
                mouseoutedx(null);
                selft.hideToolpiltex();
            })
            .on("click", function (d, i) {
                selft.keepselectvertex = i;
                mouseoveredx(d);
            });
        //.merge(self.node);

        function mouseoveredx(d) {
            self.viewlayoutgraphtree(d);
        };

        function mouseoutedx(d) {
            self.viewlayoutgraphtree(d);
        };

        //target node
        if (self.initv != -1) {
            var selectionBArray = self.svgw.selectAll(".node")["_groups"][0];
            selectionBArray[self.initv].style.fill = "#666";
        }
        //target node
        if (self.initv2 != -1) {
            var selectionBArray = self.svgw.selectAll(".node")["_groups"][0];
            selectionBArray[self.initv2].style.stroke = "#72ab41";
        }

        // initial radial layout
        //self.stopforce();
    };
    
    this.updatecolors = function () {
        var selectionBArray = self.svgw.selectAll("circle").nodes();
        self.node
        .style("fill", function (d) {
            return (d.category == 1) ? '#ccc' : self.vertexcolorf(d.weight);
        })
        .style("stroke", function (d) {
            return (d.category == 1) ? '#ccc' : "#fff";
        });

        for (var i in selft.featureselected) {
            cir = selectionBArray[selft.featureselected[i]];
            cir.style.stroke = d3.color(cir.style.fill).darker();
            cir.style.strokeWidth = 2.25;
            cir.style.opacity = "1.0";
        }
    };

    this.updatesizecircle = function (pct) {
        self.sizecircleper = pct;
        self.node
            .attr("r", function (d) {
                return (d.category == 1) ? 1.75 : ((d.weight * (self.ratio)) + 3) + (self.sizecirclemax * self.sizecircleper);
            });
    };

    this.drawedges = function () {
        self.linksForce = d3.forceLink(self.graph.linkupdate)
            .distance(function (d) {

                return ((self.ratio * 2) + (self.graph.nodes[d.source.index].weight + d.weight +
                    self.graph.nodes[d.target.index].weight + d.weight)) + 2.25 + (self.sizecirclemax * self.sizecircleper) * 2.0;
            });

        self.simulation
            .nodes(self.graph.nodes)
            .force("link", self.linksForce)
            .force("charge", d3.forceManyBody().strength(self.fonceb))
            .force("x", d3.forceX())
            .force("y", d3.forceY());



        self.link = self.link.data(self.graph.linkupdate);
        self.link.exit().remove();
        self.link = self.link.enter().append("line")
            .attr("class", "link")
            .merge(self.link);

        self.showedges();
    };



    this.initlocation = function () {
        var re = self.radiallayout;
        self.node.attr("cx", function (d, i) { return re[i].x; })
            .attr("cy", function (d, i) { return re[i].y })
            .attr("x", function (d, i) { return re[i].x })
            .attr("y", function (d, i) { return re[i].y });

        self.link.attr("x1", function (d) { return re[d.source.index].x; })
            .attr("y1", function (d) { return re[d.source.index].y; })
            .attr("x2", function (d) { return re[d.target.index].x; })
            .attr("y2", function (d) { return re[d.target.index].y; });

        for (var i in self.graph.nodes) {
            self.graph.nodes[i]["x"] = re[i].x;
            self.graph.nodes[i]["y"] = re[i].y;
        }
    };

    this.selectbythreshold = function (T1) {
        self.T1 = T1;
        var i, d;
        var d;
        selft.featureselected = [];
        var taindex = selft.auxfeatureselectedf[selft.target];
        for (i = 0; i < self.graph.nodes.length; ++i) {
            d = self.graph.nodes[i];
            if (d.category == 0 && d.weight >= self.T1 && d.name != taindex) {
                selft.featureselected.push(d.name);
            }
        }
        if (selft.intarget && selft.featureselected.length > 0) {
            selft.featureselected.push(taindex);
        }
        self.highlightforce(selft.featureselected);
    };

    this.highlightforce = function (ids) {
        var selectionBArray = self.svgw.selectAll("circle").nodes();
        self.svgw.selectAll("circle")
            .style("stroke", "white")
            .style("stroke-width", function (d) {
                return (d.category == 1) ? 0.0 : 0.75;
            });

        var esel = gelem(self.argms["infright"]);
        esel.innerHTML = "/ SELECTED: " + ids.length;
        if (ids.length > 0) {

            if (self.iscoloslider) {
                self.iscoloslider = false;
                
                self.viewlayoutgraphtree();
            }

            self.svgw.selectAll("circle")
                .style("opacity", function (d) {
                    return (d.category == 1) ? 1.0 : 0.5;
                })
                .style("stroke-width", function (d) {
                    return (d.category == 1) ? 0.0 : 0.75;
                });

            var filterfe = [];
            //console.log("idsidsids", ids)
            for (var i of ids) {
                filterfe.push(selft.datagff.fenames[self.graph.nodes[i].label]);
            }
            gelem('fesenanetxt').value = filterfe.join("&&");
        }
        else {
            selft.keepselectvertex = -1;
            self.iscoloslider = true;
            
            self.viewlayoutgraphtree();

            self.svgw.selectAll("circle")
                .style("opacity", 1.0);


            esel.innerHTML = "/ SELECTED: " + 0;
        }
        
        for (var i in ids) {
            cir = selectionBArray[ids[i]];
            cir.style.stroke = d3.color(cir.style.fill).darker();
            cir.style.strokeWidth = 2.25;
            cir.style.opacity = "1.0";
        }
    };


    this.updatelinkoption = function (limi, type) {
        if (type == "percen") {
            self.updatelink(0.0, type);
            self.updatelink(limi, type);
        }
        else if (type == "array") {
            var ids = {};
            self.updatelink(ids, type);
            self.updatelink(limi, type);
        }
        else if (type == "limiar") {
            self.updatelink(-1.0, type);
            self.updatelink(limi, type);
        }
    };

    this.updatelink = function (limi, type) {
        self.stopforce();
        self.graph["linkupdate"] = [];
        self.graph["linkupdate"].length = 0;
        self.graph["linkupdate"] = self.graph.links.slice();

        if (type == "percen") {
            limi = (self.graph.whole.length) * (Math.pow(limi, 3.0) / 1000000000000.0);
            shiftv = selft.exchageslider == 180 ? self.graph.whole.length - 1 : 0;
            if (limi > 0) {
                if (selft.exchageslider == 180) {
                    for (var i = 0; i < self.graph.whole.length; ++i) {
                        if (i > limi) break;
                        self.graph["linkupdate"].push(self.graph.whole[shiftv - i]);
                    }
                }
                else {
                    for (var i = 0; i < self.graph.whole.length; ++i) {
                        if (i > limi) break;
                        self.graph["linkupdate"].push(self.graph.whole[i]);
                    }
                }
            }
        }
        else if (type == "array") {
            for (var i in limi) {
                self.graph["linkupdate"].push(self.graph.whole[limi[i]]);
            }
        }
        else if (type == "limiar") {
            for (var i = 0; i < self.graph.whole.length; ++i) {
                if (self.graph.whole[i].weight > limi) break;
                self.graph["linkupdate"].push(self.graph.whole[i]);
            }
        }

        if (self.isplay) {
            self.playforce();
            self.drawedges();
        }
        else {
            self.stopforce();
            self.drawedges();
            self.tick();
            self.stopforce();
        }
        self.isupdatebundling = true;
    };

    this.tick = function () {
        if (self.isradiallayout) {
            self.initlocation();
            // self.graph.nodes
        }
        else {
            self.node.attr("cx", function (d) { return (self.width / 2) + d.x; })
                .attr("cy", function (d) { return (self.height / 2) + d.y; });

            self.link.attr("x1", function (d) { return (self.width / 2) + d.source.x; })
                .attr("y1", function (d) { return (self.height / 2) + d.source.y; })
                .attr("x2", function (d) { return (self.width / 2) + d.target.x; })
                .attr("y2", function (d) { return (self.height / 2) + d.target.y; });
        }
    };
    self.stopplayforce = function () {
        self.isradiallayout = false;
        if (self.isplay) {
            self.stopforce();
        }
        else {
            self.playforce();
        }
    };
    self.stopforce = function () {
        self.simulation.stop();
        self.tick();
        self.isplay = false;
    };
    self.playforce = function () {
        self.isupdatebundling = true;

        self.showedges();
        self.simulation.restart();
        self.simulation.on("tick", self.tick);
        self.isplay = true;
    };


    self.showedgebundling = function () {
        self.stopforce();
        if (self.isupdatebundling) {
            var fbundling = d3.ForceEdgeBundling()
                .nodes(self.simulation.nodes())
                .edges(self.simulation.force('link').links().map(function (edge) {
                    return {
                        source: self.simulation.nodes().indexOf(edge.source),
                        target: self.simulation.nodes().indexOf(edge.target)
                    }
                }));

            self.link2 = self.links.selectAll('path').data(fbundling());
            self.link2.exit().remove();
            self.link2 = self.link2.merge(self.link2.enter().append('path'))
                .attr('d', self.d3line);

            if (!self.isradiallayout) {
                self.link2
                    .attr("transform", "translate(" + self.width / 2 + "," + self.height / 2 + ")");
            }

            self.isupdatebundling = false;
        }
        
        self.link.style("stroke-opacity", 0.0);

        self.viewlayoutgraphtree_edgebundling();

        self.isshowedgesshift = false;
    };


    ////////////////////////////////////////
    ////////////////////////////////////////
    ////////////////////////////////////////
    // to selection nodes
    //    var container = svg.append("g");
    //    var svgw = svgw;

    //    selected = [];
    //    coords = [];
    //    line = d3.line();


    self.translatte = function (vx, vy) {
        cent = { "k": self.transform.k, "x": vx, "y": vy };

        self.transform.x += vx * self.transform.k;
        self.transform.y += vy * self.transform.k;

        self.container.attr("transform", self.transform);
    };

    self.viewlayoutgraphtree = function(d=null){
        if (self.isshowedgesshift) {
            self.viewlayoutgraphtree_normal(d);
        }
        else {
            self.viewlayoutgraphtree_edgebundling(d);
        }
    }

    self.viewlayoutgraphtree_normal = function(d=null){
            self.link
            .style('stroke', function (link_d, i) {
                return  link_d.source === d |
                        link_d.target === d |
                        link_d.source.index == selft.keepselectvertex |
                        link_d.target.index == selft.keepselectvertex ?
                        '#009eff' : self.edgecolorf(link_d.weight);
            })
            .style("stroke-opacity", function (link_d, i) {
                return  link_d.source === d |
                        link_d.target === d |
                        link_d.source.index === selft.keepselectvertex |
                        link_d.target.index === selft.keepselectvertex ?
                        1.0 : selft.edgetransparency;
            })
            .style("stroke-width", function (link_d, i) {
                return  i < self.graph.links.length ?
                        2.5 :
                        link_d.source === d |
                        link_d.target === d |
                        link_d.source.index === selft.keepselectvertex |
                        link_d.target.index === selft.keepselectvertex ?
                        2.0 : 1.0;
            });
    };

    self.viewlayoutgraphtree_edgebundling = function(d=null){
        self.link2
        .style('stroke', function (link_d, i) {
            return  self.graph.linkupdate[i].source === d |
                    self.graph.linkupdate[i].target === d |
                    self.graph.linkupdate[i].source.index === selft.keepselectvertex |
                    self.graph.linkupdate[i].target.index === selft.keepselectvertex ?
                    '#009eff' : self.edgecolorf(self.graph.linkupdate[i].weight);
        })
        .style("stroke-opacity",function (link_d, i) {
            return  self.graph.linkupdate[i].source === d |
                    self.graph.linkupdate[i].target === d |
                    self.graph.linkupdate[i].source.index === selft.keepselectvertex |
                    self.graph.linkupdate[i].target.index === selft.keepselectvertex ?
                    1.0 : selft.edgetransparency;
        })
        .style("stroke-width", function (link_d, i) {
            return  i < self.graph.links.length ?
                    2.5 :
                    self.graph.linkupdate[i].source === d |
                    self.graph.linkupdate[i].target === d |
                    self.graph.linkupdate[i].source.index === selft.keepselectvertex |
                    self.graph.linkupdate[i].target.index === selft.keepselectvertex ?
                    2.0 : 1.0;
        });
    };

        
    self.updateedgestransparency = function () {
        self.viewlayoutgraphtree();
    };
    ////////////////////////////////////////
    ////////////////////////////////////////
    ////////////////////////////////////////


    self.drawnodes();
    self.drawedges();

    //self.playforce();
    self.stopforce();
    //self.initlocation();
}