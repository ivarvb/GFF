/*
# Author: Ivar Vargas Belizario
# Copyright (c) 2020
# E-mail: ivar@usp.br
*/

/**
 * Adapted from: https://github.com/vasturiano/sunburst-chart
 */
function chart_sunburst(idview, vertexcolorf, selft, argmsi){
    var self = this;
    self.wsize =selft.lwidth;
    //self.data = selft.datagff.layoutfeature["tree"];
    self.graph = selft.datagff.layoutfeature["graph"];
    self.root = selft.datagff.layoutfeature["root"];
    self.ranking = selft.datagff.layoutfeature["ranking"];
    self.initv = selft.datagff.layoutfeature["initvertex1"];
    self.initv2 = selft.datagff.layoutfeature["initvertex2"];
    self.argms = argmsi;

    self.data = maketree(self.root, self.graph["nodes"], self.initv2);
    //console.log("X·E",self.data);
    
    gelem(self.argms["infleft"]).innerHTML = "TOTAL: " + selft.datagff.layoutfeature["ranking"].length;

    const vmargin = 10;
    const width = self.wsize,
        height = self.wsize,
        maxRadius = (Math.min(width, height) / 2) - vmargin;

    const formatNumber = d3.format(',d');

    const x = d3.scaleLinear()
        .range([0, 2 * Math.PI])
        .clamp(true);

    const y = d3.scaleSqrt()
        .range([maxRadius*.1, maxRadius]);

    const color = d3.scaleOrdinal(d3.schemeCategory20);

    const partition = d3.partition();

    const arc = d3.arc()
        .startAngle(d => x(d.x0))
        .endAngle(d => x(d.x1))
        .innerRadius(d => Math.max(0, y(d.y0)))
        .outerRadius(d => Math.max(0, y(d.y1)));

    const middleArcLine = d => {
        const halfPi = Math.PI/2;
        const angles = [x(d.x0) - halfPi, x(d.x1) - halfPi];
        const r = Math.max(0, (y(d.y0) + y(d.y1)) / 2);

        const middleAngle = (angles[1] + angles[0]) / 2;
        const invertDirection = middleAngle > 0 && middleAngle < Math.PI; // On lower quadrants write text ccw
        if (invertDirection) { angles.reverse(); }

        const path = d3.path();
        path.arc(0, 0, r, angles[0], angles[1], invertDirection);
        return path.toString();
    };

    const textFits = d => {
        const CHAR_SPACE = 6;

        const deltaAngle = x(d.x1) - x(d.x0);
        const r = Math.max(0, (y(d.y0) + y(d.y1)) / 2);
        const perimeter = r * deltaAngle;
        //if (d.category != 1){
        
        var strinma = (self.graph.nodes[d.data.id].category == 1)? "extra" : selft.datagff.fenames[d.data.name];
        return strinma.length * CHAR_SPACE < perimeter;
    };

    this.svg;
    this.slice;
    this.newSlice;
    this.text;
    this.ppp;
    this.pppi = [];

    d3.select(idview).selectAll("svg").remove();
    this.svg = d3.select(idview).append('svg')
        .style('width', width)
        .style('height', height)
        .attr('viewBox', `${-width / 2} ${-height / 2} ${width} ${height}`)
        .on('click',  function(d){
            if (selft.ispresskey == 0) {
                focusOn(d);
            }
        }); // Reset zoom on canvas click

//            d3.json('https://gist.githubusercontent.com/mbostock/4348373/raw/85f18ac90409caa5529b32156aa6e71cf985263f/flare.json', (error, root) => {
//                if (error) throw error;

    self.drawchart = function(){
        
        root = d3.hierarchy(self.data);
        root.sum(d => d.size);

        self.ppp = partition(root).descendants();
        self.slice = self.svg.selectAll('g.slice')
            .data(self.ppp);

        self.pppi = Array(Object.keys(selft.lfenamesindex).length).fill(-1);

        for (var i in self.ppp){
            var id = self.ppp[i].data["id"];
            self.pppi[id] = i;
        }

        self.slice.exit().remove();

        self.newSlice = self.slice.enter()
            .append('g').attr('class', 'slice')
            .on('click', d => {
                self.selecnodes(d);
            });

        self.newSlice.append('title')
            //.text(d => d.data.name + '\n' + (graph.nodes[d.data.name].weight));
            .text(d => {
                var strinma = (self.graph.nodes[d.data.id].category == 1)? "extra" : selft.datagff.fenames[d.data.name]+": "+self.graph.nodes[d.data.id].weight;
                return strinma+'\n';
            });

        self.newSlice.append('path')
            .attr('class', 'main-arc')
            // to color
//            .style('fill', d => color((d.children ? d : d.parent).data.name))
            .style('fill', function(d){
                return (self.graph.nodes[d.data.id].category == 1) ? '#ccc' : vertexcolorf(self.graph.nodes[d.data.id].weight);
            })
            .attr('d', arc);
        //target node
        if (self.initv != -1) {
            var selectionBArray = self.newSlice.selectAll(".main-arc").nodes();
            selectionBArray[self.pppi[self.initv]].style.fill = "#666";
        }


        self.newSlice.append('path')
            .attr('class', 'hidden-arc')
            .attr('id', (_, i) => `hiddenArc${i}`)
            .attr('d', middleArcLine);

        self.text = self.newSlice.append('text')
            .attr('display', d => textFits(d) ? null : 'none');

        // Add white contour
        self.text.append('textPath')
            .attr('startOffset','50%')
            .attr('link:href', (_, i) => `#hiddenArc${i}` )
            .text(d => {
                var strinma = (self.graph.nodes[d.data.id].category == 1)? "extra" : selft.datagff.fenames[d.data.name];
                return strinma;
            })
            //.text(d => "ss")
            .style('fill', 'none')
            .style('stroke', '#fff')
            .style('stroke-width', 5)
            .style('stroke-linejoin', 'round');

        self.text.append('textPath')
            .attr('startOffset','50%')
            .attr('link:href', (_, i) => `#hiddenArc${i}` )
            .text(d => {
                var strinma = (self.graph.nodes[d.data.id].category == 1)? "extra" : selft.datagff.fenames[d.data.name];
                return strinma;
            });
            //.text(d => "zz");
//            });
    };
    self.drawchart();

    this.selecnodes = function (d) {
        if (selft.ispresskey == 1 || selft.ispresskey == 2) {
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
            
            if (d.data["id"] != taindex) {
                auxfeatureselected.push(d.data["id"]);
            }
            
            if (selft.ispresskey == 1) {
                for (var i in auxfeatureselected) {
                    var e = auxfeatureselected[i];
                    var ev = auxfeatureselected_vis[e];
                    if (ev == 0) {
                        selft.featureselected.push(e);
                    }
                }
            }
            if (selft.ispresskey == 2) {
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
            if (selft.intarget && auxfeatureselected_vis[taindex] == 0 && selft.featureselected.length > 0) {
                selft.featureselected.push(taindex);
            }

            self.highlightforce(selft.featureselected);
        }
        else{
            d3.event.stopPropagation();
            focusOn(d);
        }
    };

    this.highlightforce = function (ids) {
        self.newSlice.selectAll(".main-arc")
            .style('stroke', '#ffffff')
            .style('opacity', function(d){
                return '0.35';
            });

        var esel = gelem(self.argms["infright"]);
        esel.innerHTML = "/ SELECTED: " + ids.length;

        if (ids.length > 0) {

            var filterfe = [];
            for (var i of ids) {
                //filterfe.push(self.graph.nodes[i].label);
                filterfe.push(selft.datagff.fenames[self.graph.nodes[i].label]);
            }
            gelem('fesenanetxt').value =  filterfe.join("&&");

            
            var selectionBArray = self.newSlice.selectAll(".main-arc").nodes();
            // var selectionBArraytxt = self.text.selectAll("textPath").nodes();
            //console.log("selectionBArray",selectionBArraytxt);
            for (var i in ids) {
                //console.log("IUIU:",i,ids[i]);
                cir = selectionBArray[self.pppi[ids[i]]];
                //cir.style.stroke = d3.color(cir.style.fill).darker();
                //cir.style.strokeWidth = 2.25;
                cir.style.opacity = "1.0";


                // txt = selectionBArraytxt[self.pppi[ids[i]]];
                // txt.style.stroke = d3.color(cir.style.fill).darker();
            }    
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

    this.updatelinkoption = function (limi, type) {

    };
    
    this.showedges = function () {
        //
    };
    this.updateedgestransparency = function () {
        //
    };
    this.updatesizecircle = function (pct) {
        //
    };

        
    function focusOn(d = { x0: 0, x1: 1, y0: 0, y1: 1 }) {
        //console.log("execute on ");
        // Reset to top-level if no data point specified

        const transition = self.svg.transition()
            .duration(550)
            .tween('scale', () => {
                const xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
                    yd = d3.interpolate(y.domain(), [d.y0, 1]);
                return t => { x.domain(xd(t)); y.domain(yd(t)); };
            });

        transition.selectAll('path.main-arc')
            .attrTween('d', d => () => arc(d));

        transition.selectAll('path.hidden-arc')
            .attrTween('d', d => () => middleArcLine(d));

        transition.selectAll('text')
            .attrTween('display', d => () => textFits(d) ? null : 'none');

        moveStackToFront(d);

        //

        function moveStackToFront(elD) {
            self.svg.selectAll('.slice').filter(d => d === elD)
                .each(function(d) {
                    this.parentNode.appendChild(this);
                    if (d.parent) { moveStackToFront(d.parent); }
                });
        }
    }

}

function maketree(graph, nodes, root){
    //visi = [false for i in range(len(graph))]
    visi = Array(graph.length).fill(false);
    i = parseInt(root);
    XX = {"id":i, "name":nodes[i]["label"], "size":nodes[i]["weight"]+0.01};

    de = new Deque();
    de.insertBack(XX);
    //de.append(XX)
    while (de.isEmpty()==false){
        ei = de.getFront();
        de.removeFront(); 

        i = ei["id"];
        if (Object.keys(graph[i]).length>0){
            ei["children"] = [];
        }
        c = 0;
        //console.log("graph[i]", graph[i]);
        for (var j in graph[i]){
            //console.log("j", j);
            j = parseInt(j);
            if (visi[j]==false){
                //console.log("ei", ei);
                ei["children"].push({"id":j, "name":nodes[j]["label"], "size":nodes[j]["weight"]+0.01});
                de.insertBack(ei["children"][c]);
                c+=1;
            }
        }
        visi[i]=true;
    }
    //console.log("XXXX111",XX);
/*     de = new Deque();
    de.insertBack(XX);
    while (de.isEmpty()==false){
        ei = de.getFront();
        de.removeFront(); 

        i = ei["id"];
        console.log("ei",ei);
        if ("children" in ei){
            if (ei["children"].length>0){
                for (var e in ei["children"]){
                    de.insertBack(e);
                }
            }
            else{
                delete ei["children"];
            }
        }
    }
    console.log("XXXX222",XX); */
    return XX;
}



function Deque() {
    //To track the elements from back
    let count = 0; 
    
    //To track the elements from the front
    let lowestCount = 0;
    
    //To store the data
    let items = {};
    
    //Add an item on the front
    this.insertFront = (elm) => {
      
      if(this.isEmpty()){
        //If empty then add on the back
        this.insertBack(elm);
     
      }else if(lowestCount > 0){
        //Else if there is item on the back 
        //then add to its front
        items[--lowestCount] = elm;
        
      }else{
        //Else shift the existing items 
        //and add the new to the front
        for(let i = count; i > 0; i--){
          items[i] = items[i - 1];
        }
        
        count++;
        items[0] = elm;
      }
    }
    
    //Add an item on the back of the list
    this.insertBack = (elm) => {
      items[count++] = elm;
    }
    
    //Remove the item from the front
    this.removeFront = () => {
      //if empty return null
      if(this.isEmpty()){
        return null;
      }
      
      //Get the first item and return it
      const result = items[lowestCount];
      delete items[lowestCount];
      lowestCount++;
      return result;
    }
    
    //Remove the item from the back
    this.removeBack = () => {
      //if empty return null
      if(this.isEmpty()){
        return null;
      }
      
      //Get the last item and return it
      count--;
      const result = items[count];
      delete items[count];
      return result;
    }
    
    //Peek the first element
    this.getFront = () => {
      //If empty then return null
      if(this.isEmpty()){
        return null;
      }
      
      //Return first element
      return items[lowestCount];
    }
    
    //Peek the last element
    this.getBack = () => {
      //If empty then return null
      if(this.isEmpty()){
        return null;
      }
      
      //Return first element
      return items[count - 1];
    }
    
    //Check if empty
    this.isEmpty = () => {
      return this.size() === 0;
    }
    
    //Get the size
    this.size = () => {
      return count - lowestCount;
    }
    
    //Clear the deque
    this.clear = () => {
      count = 0;
      lowestCount = 0;
      items = {};
    }
    
    //Convert to the string
    //From front to back
    this.toString = () => {
      if (this.isEmpty()) {
        return '';
      }
      let objString = `${items[lowestCount]}`;
      for (let i = lowestCount + 1; i < count; i++) {
        objString = `${objString},${items[i]}`;
      }
      return objString;
    }
  }