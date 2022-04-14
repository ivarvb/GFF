

function create_radviz(projectioncolorf, selfgff, container){
    var self = this;
    this.projectioncolorf = projectioncolorf;

    /////
    this.features = selfgff.featureselected;
    this.data = selfgff.datagff.layoutinstance.points; //x,y,t
    this.vertexop =  selfgff.instvertexoacity;
    
    /* codigo D3 radviz */
    this.execute = function () {
        /* 
        xx=self.features;    
        yy=self.data;    
        zz=self.vertexop;
        */

        for (var i of selfgff.featureselected) {
            var item = selfgff.getNode(i);
            //item.name // name
            score = selfgff.datagff.configfeature.nodes[item.name].weight;
        }

        // ver char_projection.js // linea 181-->
        // this.data
    };

    /////
    vis -> container;
}