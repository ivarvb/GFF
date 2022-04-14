/*
# Author: Ivar Vargas Belizario
# Copyright (c) 2020
# E-mail: ivar@usp.br
*/


/**
 * Making initial objects
 */


/**
 * Auxiliar methods
 */
function DataIO() {
    var data = {
        "argms": {}
    };
    return data;
}

/* 
function showloading(text) {
    gelem("idloading").style.display = "block";
    gelem("idloadingtxt").innerHTML = text+" ...";
}
function showstatus(load) {
    gelem("idloadingload").style.width = load+"%";
    //gelem("idloadingload").innerHTML = size;
}
function hideloading() {
    gelem('idloading').style.display = "none";
}
 */


/**
 * Claass: SevcieData
 */
function ServiceData(pname) {
    var self = this;
    this.in = new DataIO();
    this.ou = '';

    this.event = function () { };
    
    this.start = function () {
        //ep = new ElementMP();
        //ep.name = pname;
        //ep.process = function (){
        var ps = MOPRO.pushprocess(pname);
        //MOPRO.show(pname);
        try {
            var url = "./query?data=" + JSON.stringify(self.in);
            d3.json(url, function (data) {
                self.ou = data;
                self.event();
                MOPRO.popprocess(ps);
            });
        }
        catch (err) {
            //MOPRO.hide();
            MOPRO.popprocess(ps);
            //MPRO.delete(this.id);
            console.log(err);
        }
        //};
        //key = MPRO.insert(ep);
        ////
    };
}


/**
 * Claass: Graph From Features
 */
function GraphFromFeatures() {
    let self = this;
    this.datax = {}

    this.listinstances = [
        {
            "collect":"instances",
            "query":    [
                            ["configinstance"],
                            ["typeinstance"],
                            ["layoutinstance"],
                            ["versioninstance"],
                        ]
        }
    ];

    
    this.listfeatures = [
        {
            "collect":"features",
            "query":    [
                            ["configfeature"],
                            ["typefeature"],
                            ["versionfeature"],
                            ["featurecheck"],

                            ["layoutfeature","root"],
                            ["layoutfeature","ranking"],
                            ["layoutfeature","rankingmin"],
                            ["layoutfeature","rankingmax"],
                            ["layoutfeature","initvertex1"],
                            ["layoutfeature","initvertex2"],
                            ["layoutfeature","tree"],
                            ["layoutfeature","treehi"],
                            ["layoutfeature","edgehist"]
                        ]
        },

        {
            "collect":"features",
            "query":    [
                            ["layoutfeature","graph","nodes"]
                        ]
        },

        {
            "collect":"features",
            "query":    [
                            ["layoutfeature","graph","links"]
                        ]
        },

        {
            "collect":"features",
            "query":    [
                            ["layoutfeature","graph","whole"]
                        ]
        },

    ];
    

    this.listbase = [
                            {
                                "collect":"features",
                                "query":    [

                                                ["fenames"],
                                                ["lastversion"],
                                                    
                                                ["_id"],
                                                ["name"],
                                                ["type"],

                                                /* features */
                                                /* instances */

                                                ["datecreate"],
                                                ["dateupdate"],
                                                ["hasupdate"],
                                                ["isshare"],
                                                
                                                ["statusopt"],
                                                ["statusval"],
                                                
                                                ["_id_user"]
                                            ]
                            },

                        ];

    this.listdataset = this.listbase.concat(this.listfeatures, this.listinstances);
    this.listdataset_count = 0;
    this.datagff = {};

    //console.log("this.listdataset", this.listdataset);



    this.mw = new ModalWindow();
    this.USFOBJ = new UnselectedFeatures("idselectedfebt","idunselectedfecont",self);
        
    this.adminid = 0;
    this.email = "";
    this.multiuser = 0;

    this.layoutfeatures = null;
    this.layoutinstance = null;

    this.dataload = [];
    this.datafiles = [];
    this.featureselected = [];
    //this.ranking = [];
    this.datafileselected = "";
    this.datafileselectedname = "";
    this.lwidth = ((window.screen.availWidth) / 2) - 100;

    this.isnamedbedited = false;
    this.intarget = false;
    this.exchageslider = 0;
    this.intargetaction = false;
    this.target = "";
    this.lfenamesindex = {};
    //this.lfenames = []
    //this.dataoutfeature = null;
    //this.dataoutinstance = null;
    this.edgetransparency = 0.75;

    this.instvertexratio = 4;
    this.instvertexoacity = 0.75;


    this.ispresskey = 3;
    this.keepselectvertex = -1;

    this.colorstableshitttype = -1;

    
    // new attributes
    this.unselectedfeids = [];
    this.idinstancelabel = [];
    
    this.auxfeatureselectedf = {};
    this.auxfeatureselectedi = {};


    this.featuresChecks = [];
    this.featuresChecks_count = 0;

/*     this.featuresChecks = [];
    this.featuresChecks_count = 0; */

    this.makeFeatureAux = function(nodes){
        var rest = {};
        for(var e of nodes){
            rest[e.label] = e.name;
        }
        return rest;
    };

    this.makeInstancesLabels = function(colname){
        if (self.datafileselected != "" && colname!=""){
            var ob = new ServiceData("compute instances labels");
            ob.in.argms["type"] = 21;
            ob.in.argms["file"] = self.datafileselected;
            ob.in.argms["idinstanceslabels"] = parseInt(colname);

            ob.event = function () {
                self.idinstancelabel = this.ou;
            };
            ob.start();
        }
    };


    this.getfeatureselected = function (){
        var featureselectedTrueIds = [];
        for(var i of self.featureselected){
            label = self.getNode(i).label;
            //tid = self.lfenamesindex[label];
            tid = label;
            if (self.USFOBJ.at(tid).value==0){
                featureselectedTrueIds.push(tid);
            }
        }
        return featureselectedTrueIds;
    };

    this.setfeatureselected = function (featureselected){
        rest = [];
        for(var i of featureselected){
            //nam = self.datagff.fenames[i];
            //rest.push(self.auxfeatureselectedf[nam]);
            
            //nam = self.datagff.fenames[i];
            rest.push(self.auxfeatureselectedf[i]);            
        }
        //console.log("WSDself.auxfeatureselectedf", self.auxfeatureselectedf);
        return rest;
    };

    this.visFeatures = function () {
        self.cleanfeatures();
        //self.setfullScreen();
        self.unselectedfeids = self.USFOBJ.getUnselected();        
        
        if (self.datafileselected != "" && self.unselectedfeids.length<(self.datagff.fenames.length-1)) {
            self.cleanfeatures();
            var status = "making graphs from featuresxx";
            
            var ob = new ServiceData(status);
            ob.in.argms["type"] = 0;
            ob.in.argms["file"] = self.datafileselected;
            ob.in.argms["target"] = self.target;
            ob.in.argms["intarget"] = self.intarget;
            ob.in.argms["proximity"] = gvalue('proximity');
            ob.in.argms["instanceproximity"] = gvalue('instanceproximity');
            ob.in.argms["relevance"] = gvalue('relevance');
            ob.in.argms["algorithm"] = gvalue('algorithm');
            ob.in.argms["layout"] = gvalue('layout');
            ob.in.argms["isfeature"] = 1;
            ob.in.argms["featureselected"] = self.getfeatureselected();
            ob.in.argms["ranking"] = [];

            ob.in.argms["idinstanceslabels"] = gvalue("idinstanceslabels");

            ob.in.argms["statusval"] = status;
            //console.log("ob.in", ob.in);
            ob.event = function () {
                //ok
                if(this.ou["statusopt"]==0){                
                    self.dequeLoadFeatures();
                }
                //working
                else if(this.ou["statusopt"]==1){
                    //lockk
                    //setTimeout(self.visFeatures, 5000);
                    self.dequeLoadFeatures();
                }
                //error
                else if(this.ou["statusopt"]==2){
                    console.log("error");
                }
            };
            ob.start();
        }
    };


    this.visInstnaces = function () {
        self.cleaninstances();
        //self.setfullScreen();
        if (self.featureselected.length >= 2) {
            var status = "making projection from features selected";
            var ob = new ServiceData(status);
            ob.in.argms["type"] = 1;
            ob.in.argms["threshold"] = 0.78;
            ob.in.argms["target"] = self.target;
            ob.in.argms["intarget"] = self.intarget;
            ob.in.argms["proximity"] = gvalue('proximity');
            ob.in.argms["instanceproximity"] = gvalue('instanceproximity');
            ob.in.argms["relevance"] = gvalue('relevance');
            ob.in.argms["algorithm"] = gvalue('algorithm');
            ob.in.argms["layout"] = gvalue('layout');
            ob.in.argms["projection"] = gvalue('projection');
            ob.in.argms["topleft"] = 'topleft2';
            ob.in.argms["topfright"] = 'topright2';
            ob.in.argms["infleft"] = 'infleft2';
            ob.in.argms["infright"] = 'infright2';
            ob.in.argms["file"] = self.datafileselected;
            ob.in.argms["isfeature"] = 0;
            ob.in.argms["featureselected"] = self.getfeatureselected();
            ob.in.argms["ranking"] = [];

            ob.in.argms["idinstanceslabels"] = gvalue("idinstanceslabels");

            ob.in.argms["statusval"] = status;

            //self.unselectedfeids
            if (ob.in.argms["projection"] == "mst") {

            }
            else if (ob.in.argms["projection"] == "simple") {
                self.loadfilecsv();
                setTimeout( function() {
                                MOPRO.show("simple projection");
                            }
                            , 1);
                setTimeout(self.plotpaiercorrelate, 100);
            }
            else {
                ob.event = function () {
                    if(this.ou["statusopt"]==0){
                        self.dequeLoadInstances();
                    }
                    else if(this.ou["statusopt"]==1){
                        //setTimeout(self.visInstnaces, 5000);
                        self.dequeLoadInstances();
                    }
                    else if(this.ou["statusopt"]==2){
                        console.log("error");
                    }
                };
                ob.start();
            }
        }
    };
    

   


    /**
     * Load one dataset
     */
    this.dequeLoadDataset = function(datasetid){
        var obj = {};
        var count = 0;
        var pname ="loading dataset";
        loadObject(pname, obj, self.listdataset, count, datasetid,
            //process function
            function (obj, ou) {
                for(let q of ou["response"]){
                    setDict(obj, q["query"], q["response"]);
                }
            },
            //end function
            function (obj) {       
                self.datagff = {};
                self.datagff = obj;
                
                self.processFeaturesResults(self.datagff);
                self.processInstancesResults(self.datagff);
            },
            //busy function
            function (ou) {
                var ps = MOPRO.pushprocess(pname);
                setTimeout(function(){
                    MOPRO.popprocess(ps);
                    self.dequeLoadDataset(datasetid);
                }, 5000);
            },
            24
        );
    };


    /**
     * Load one dataset-features
     */
     this.dequeLoadFeatures = function(){
        var count = 0;
        var obj = {};
        var pname = "loading dataset (features)";
        loadObject(pname, obj, self.listfeatures, count, self.datafileselected, 
            //process function
            function (obj, ou) {
                for(let q of ou["response"]){
                    setDict(obj, q["query"], q["response"]);
                }
            }, 
            //end function
            function(obj) {
                self.datagff["configfeature"] = {};
                self.datagff["typefeature"] = {};
                self.datagff["layoutfeature"] = {};
                self.datagff["versionfeature"] = {};
                self.datagff["featurecheck"] = {};
                
                for (var k in obj){
                    self.datagff[k] = {};
                    self.datagff[k] = obj[k];
                }

                self.processFeaturesResults(self.datagff);
            },
            //busy function
            function (ou) {
                var ps = MOPRO.pushprocess(pname);
                setTimeout(function(){
                    MOPRO.popprocess(ps);
                    self.dequeLoadFeatures();
                }, 5000);
            },
            24
        );
    };


    /**
     * Load one dataset-features
     */
     this.dequeLoadInstances = function(){
        var count = 0;
        var obj = {};
        var pname = "loading dataset (instances)";
        loadObject(pname, obj, self.listinstances, count, self.datafileselected, 
            //process function
            function (obj, ou) {
                for(let q of ou["response"]){
                    setDict(obj, q["query"], q["response"]);
                }
            }, 
            //end function
            function(obj) {
                self.datagff["configinstance"] = {};
                self.datagff["typeinstance"] = {};
                self.datagff["layoutinstance"] = {};
                self.datagff["versioninstance"] = {};

                for (var k in obj){
                    self.datagff[k] = {};
                    self.datagff[k] = obj[k];
                }
                self.processInstancesResults(self.datagff);
            },
            //busy function
            function (ou) {
                var ps = MOPRO.pushprocess(pname);
                setTimeout(function(){
                    MOPRO.popprocess(ps);
                    self.dequeLoadInstances();
                }, 5000);
            },
            24
        );
    };

    /**
     * Send select and unselect features
     */
    this.dequeSendFeaturesChecks = function () {
        self.unselectedfeids = self.USFOBJ.getUnselected();                
        if (self.datafileselected != "" && self.unselectedfeids.length<(self.datagff.fenames.length-1)) {
            var list = [];
            for (var e of self.USFOBJ.unselectedfeatures){
                var v = e.value==1 ? 0 : 1;
                list.push([e.id, v]);
            }
            //self.featuresChecks = chunk(self.USFOBJ.unselectedfeatures,5);
            self.featuresChecks = chunk(list,100);
            
            var count = 0;
            var obj = {};
            var pname = "sending features selected and unselected";
            loadObject(pname,
                obj, self.featuresChecks, count, self.datafileselected,
                // process function
                function (obj, ou) {
    
                },
                // end function
                function (obj) {
                    //MOPRO.auto = true;
                    self.visFeatures();
                },
                // busy function
                function () {
                    var ps = MOPRO.pushprocess(pname);
                    setTimeout(function(){
                        MOPRO.popprocess(ps);
                        self.dequeSendFeaturesChecks();
                    }, 5000);
                },
                23
            );
        }
    };

    this.processFeaturesResults = function(ds){
        self.shifflayoutcontrols("mainlayout");
        self.lfenamesindex = {};

        if ("fenames" in ds) {
            strs = "";
            stro = "";
            i = 0;
            for (var item of ds["fenames"]) {
                self.lfenamesindex[item] = i;
                strs += "<option value='" + i + "'>" + item + "</option>";
                stro += "<option value='" + i + "'>" + item + "</option>";
                i++;
            }
            gelem("target").innerHTML = strs;
            gelem("target").selectedIndex = Object.keys(self.lfenamesindex).length - 1;
            self.target = parseInt(gelem("target").value);
            
            gelem("idinstanceslabels").innerHTML = stro;
            gelem("idinstanceslabels").selectedIndex = 0;
            //begin new code
            self.getUnselecteFeatures();
            //////////////////////////////

        }
        //console.log("DDDDDDDDDDDDDDDDDDS", ds["lastversion"], ds["versionfeature"]);
        if ("lastversion" in ds && "versionfeature" in ds && ds["lastversion"] == ds["versionfeature"]) {
           
            if ("configfeature" in ds) {
                conf = ds["configfeature"];
                if ("target" in conf) {
                    self.target = parseInt(conf["target"]);
                    //gelem('target').value = conf["target"];
                    gelem("target").selectedIndex = self.target;
                    
                }
                    confins = ds["configinstance"];
                    if ("idinstanceslabels" in confins && confins["idinstanceslabels"]!="") {
                        const num = parseInt(confins["idinstanceslabels"], 10);
                        idcollabel = isNaN(num) ? 0 : num;
                        gelem('idinstanceslabels').selectedIndex = idcollabel;
                        self.makeInstancesLabels(idcollabel);
                    }
                    else{
                        gelem('idinstanceslabels').selectedIndex = 0;
                        self.makeInstancesLabels(gelem('idinstanceslabels').value);
                    }

                if ("proximity" in conf) {
                    gelem('proximity').value = conf["proximity"];
                }
                if ("relevance" in conf) {
                    gelem('relevance').value = conf["relevance"];
                }
                if ("algorithm" in conf) {
                    gelem('algorithm').value = conf["algorithm"];
                }
                if ("layout" in conf) {
                    gelem('layout').value = conf["layout"];
                }


                //add feature selected
                //add is target is included
                if ("intarget" in conf) {
                    self.intargetaction = conf["intarget"];
                    self.intarget = conf["intarget"];
                }
                if (Object.keys(ds.layoutfeature.graph.nodes).length > 0 ) {
                    self.auxfeatureselectedf = self.makeFeatureAux(ds.layoutfeature.graph.nodes);
                }
                if ("featureselected" in conf) {

                    self.featureselected = self.setfeatureselected(conf["featureselected"]);
                    //console.log("XXXconf[featureselected]", conf["featureselected"], self.featureselected);
                }

                /* 
                self.USFOBJ.init();
                if ("unselectedfeids" in conf) {
                    self.unselectedfeids = conf["unselectedfeids"];
                    self.USFOBJ.load();
                }
                self.USFOBJ.print();
                */
                //end new code

                if (    "typefeature" in ds &&
                        "layoutfeature" in ds &&
                        ds["layoutfeature"] != "" &&
                        "layout" in conf
                ){
                    if (ds["typefeature"] == "graph") {
                        inargms = {};
                        inargms["infleft"] = 'topleft1';
                        inargms["infright"] = 'topright1';
                        //var data = ds["layoutfeature"];
                        //console.log("self.datagff.layoutfeature", self.datagff.layoutfeature);
                        if (conf["layout"] == "fo" && Object.keys(ds["layoutfeature"]).length > 0) {
                            self.layoutfeatures = new chart_force(VertexColorF, EdgeColorF, self, "#vis", -10, inargms);
                        }
                        else if (conf["layout"] == "sb" && Object.keys(ds["layoutfeature"]).length > 0) {
                            self.layoutfeatures = new chart_sunburst("#vis", VertexColorF, self, inargms);
                        }
                        else if (conf["layout"] == "pk") {
                            self.layoutfeatures = new chart_circlepack("#vis", self, VertexColorF);
                        }
                        gelem('edgeslider').value = 0;
                        self.edgeslider = 0;
                        
                        chart_palettecolors(self.layoutfeatures.selectbythreshold,
                            "seq1", 20, self.lwidth-20, VertexColorF);

                        chart_histogram(self.setToolpiltex,
                            self.hideToolpiltex,
                            self.layoutfeatures.updatelinkoption,
                            "seqedgehist", self.lwidth, EdgeColorF, self.datagff.layoutfeature["edgehist"]);

                        self.changeintarget();
                    }
                    else if (ds["typefeature"] == "otherss") {
                        if ("layoutfeature" in ds && ds["layoutfeature"] != "" && "layout" in conf) {

                        }
                    }
                }
            }
        }
            
    };


    this.processInstancesResults = function(ds){
        self.shifflayoutcontrols("mainlayout");
        if ("lastversion" in ds && "versioninstance" in ds && ds["lastversion"] == ds["versioninstance"]) {
            //self.dataoutinstance = ds;
            if ("configinstance" in ds) {
                conf = ds["configinstance"];
                if ("projection" in conf) {
                    gelem('projection').value = conf["projection"];
                }
                if ("instanceproximity" in conf) {
                    gelem('instanceproximity').value = conf["instanceproximity"];
                }

                if ("idinstanceslabels" in conf && conf["idinstanceslabels"]!="") {
                    //idcollabel = parseInt(conf["idinstanceslabels"])
                    const num = parseInt(conf["idinstanceslabels"], 10);
                    idcollabel = isNaN(num) ? 0 : num;
                    console.log("idcollabel", idcollabel);
                    gelem('idinstanceslabels').selectedIndex = idcollabel;
                    self.makeInstancesLabels(idcollabel);
                }
                else{
                    gelem('idinstanceslabels').selectedIndex = 0;
                    self.makeInstancesLabels(gelem('idinstanceslabels').value);
                }


                if ("silhouette" in conf) {
                    gelem("topleft2").innerHTML = "SILHOUETTE: " + conf["silhouette"];
                }

            }
            if ("typeinstance" in ds) {
                if (ds["typeinstance"] == "projection") {
                    if ("layoutinstance" in ds && ds["layoutinstance"] != "") {
                        //var data = ds["layoutinstance"];
                        argms = {"infleft": 'infleft2',"infright": 'infright2'};
                        self.layoutinstance = new plotProjection(ProjectionColorF, "#visp", self, argms);

                        self.auxfeatureselectedi = self.makeFeatureAux(self.datagff.configinstance.nodes);
                    }
                }
                else if (ds["typeinstance"] == "graph") {
                    if ("layoutinstance" in ds) {
                        //
                    }
                }
            }
        }
    };

    this.loaddatasets = function () {
        var ob = new ServiceData("load datasets");
        ob.in.argms["type"] = 2;

        ob.event = function () {
            self.datafiles = this.ou;
            self.searchdataset('');
        };
        ob.start();
    };

    this.loadlayoutdbs = function () {
        //MPRO.clean();

        gelem('layoutchangenametxtdb').style.display = 'none';
        gelem('iddatasettitle').style.display = 'none';

        
/*         gelem('iddatasettitle').innerHTML = "";
        gelem("iddatasettitle").style.display = "none"
        gelem("layoutchangenametxtdb").style.display = "none" */
        
        self.loaddatasets();
        self.shifflayoutcontrols('iddatasetlayout');
    };

    this.listusers = function () {
        USERC.listUsers();
        if(self.adminid==1){
            gelem("idformnewuser").innerHTML = USERC.newUserForm();
        }
        self.shifflayoutcontrols('iduserlayout');
    };

    this.cleanfeatures = function () {
        // clear all layouts
        d3.select("#seq1").selectAll("svg").remove();
        d3.select("#vis").selectAll("svg").remove();
        d3.select("#seqedgehist").selectAll("svg").remove();
        self.hideFeaturesSelected("feature");
        gelem("infleft1").innerHTML = "";
        gelem("infright1").innerHTML = "";
        gelem("topleft1").innerHTML = "";
        gelem("topright1").innerHTML = "";

        self.exchageslider = 0;
        gelem('edgeslider').style.transform = 'rotate('+self.exchageslider+'deg)';
        self.keepselectvertex = -1;
    }

    this.cleaninstances = function () {
        d3.select("#visp").selectAll("svg").remove();
        d3.select("#seq2").selectAll("svg").remove();
        self.hideFeaturesSelected("instance");
        gelem("infleft2").innerHTML = "";
        gelem("infright2").innerHTML = "";
        gelem("topleft2").innerHTML = "";
        gelem("topright2").innerHTML = "";
    }

    this.opendataset = function (filename, usersame) {
        //console.log("filename, usersame", filename, usersame);

        self.isnamedbedited = usersame;
        
        self.USFOBJ.close();

        self.setfullScreen();

        self.cleanfeatures();
        self.cleaninstances();

        self.featureselected = [];
        //self.ranking = [];
        self.intargetaction = false;
        self.intarget = false;
        self.target = "";
        self.exchageslider = 0;

        self.layoutfeatures = null;
        self.layoutinstance = null;

        self.datafileselected = filename;
        self.getdatasetname();

        /*
        self.openfeature();
        self.openinstance();
        */
        self.shifflayoutcontrols('mainlayout');

        self.dequeLoadDataset(self.datafileselected);


    };

    this.searchdataset = function (txti) {
        let txt = trim(txti);
        gelem("idtabledatasets").innerHTML = "";
        let b = [];
        if (txt != "") {
            b = self.datafiles.filter(item => item.name.toLowerCase().indexOf(txt) > -1);
        }
        else {
            b = self.datafiles;
        }
        var stringhtml = "";
        var txtshare = "";

        if(self.multiuser==1){
            txtshare =  `<th>
                            <div style="width: 70px">
                                Is shared?
                            </div>
                        </th>
                        <th>
                            <div style="width: 60px">
                                Owner
                            </div>
                        </th>
                        `;
        }
        stringhtml = `<table class="table table-striped table-sm btn-table" style="margin: 0 auto">
                    <thead>
                        <tr>
                            <th style="width: 100%">
                                Name
                            </th>
                            `+txtshare+`
                            <th>
                                <div style="width: 150px">
                                    Last Modified
                                </div>
                            </th>
                            <th>
                                <div style="width: 150px">
                                    Actions
                                </div>
                            </th>
                        </tr>
                    <thead>
                    <tbody>`;

        isnoshare = `<i  class="fa fa-link fa-lg"
                            title="Shared"
                            style="color: #48ad09;"
                        ></i>`;
        //console.log("d",b);
        for (var i = 0; i < b.length; ++i) {
            var usersame = false;
            if (b[i]._id_user_query == b[i]._id_user) {
                usersame = true;
            }
    
            stringhtml += `<tr class="trover"
                                style="z-index:9">`;
            stringhtml += `<td
                                onclick="
                                    GFFOBJ.opendataset('`+ b[i]._id + `', `+usersame+`);
                                "
                                title="Open dataset"
                            >`+ b[i].name + `</td>`;

            issh = ""
            if (b[i].isshare == 1)
                issh = isnoshare;

            if (self.multiuser==1){
            stringhtml += `<td
                                onclick="
                                    GFFOBJ.opendataset('`+ b[i]._id + `', `+usersame+`);
                                "
                                title="Open dataset"
                            >`+ issh + `</td>`;
            }
            
            if (self.multiuser==1){
            stringhtml += `<td
                                onclick="
                                    GFFOBJ.opendataset('`+ b[i]._id + `', `+usersame+ `);
                                "
                                title="Open dataset"
                            >
                                <div
                                    style=" width: 45px;
                                            white-space: nowrap;
                                            overflow: hidden;
                                            text-overflow: ellipsis
                                    "
                                >`+ b[i].owner+ `</div></td>`;
            }

            ownclt_share = `
                            <a href="#" class="btn btn-light"
                                style="padding: 2px;"
                                title="Share dataset"
                                onclick="
                                    GFFOBJ.sharedataset('`+ b[i]._id + `');
                                "
                            >
                                <i  class="fa fa-link fa-lg"
                                    style="color: #48ad09;"
                                ></i>
                            </a>
                            <a href="#" class="btn btn-light"
                                style="padding: 2px;"
                                title="Unshare dataset"
                                onclick="
                                    GFFOBJ.unsharedataset('`+ b[i]._id + `');
                                "
                            >
                                <i class="fa fa-link fa-lg"
                                ></i>
                            </a>
                            `;
            ownclt_drop = `
                            <a href="#" class="btn btn-light"
                                style="padding: 2px;"
                                title="Drop dataset"
                                onclick="
                                    GFFOBJ.mw.option('',
                                    'Are you sure to delete the dataset?',
                                    GFFOBJ.dropdataset,
                                    ['`+b[i]._id+`']);
                                "
                            >
                                <i class="fa fa-trash fa-lg"
                                    style="color: #ff0000;"
                                ></i>
                            </a>`;

            ownclt = "";
            if (usersame) {
                if(self.multiuser==1){
                    ownclt += ownclt_share;
                    ownclt += ownclt_drop;
                }    
            }
        
            if(self.multiuser==0){
                ownclt += ownclt_drop;
            }

            stringhtml += `<td
                                onclick="
                                    GFFOBJ.opendataset('`+ b[i]._id + `', `+usersame+`);
                                "
                                title="Open dashboard"
                            >`+ b[i].dateupdate + `</td>`;
            stringhtml += `<td>
                                <div style="z-index:10">
                                    <a href="#" class="btn btn-light"
                                        style="padding: 2px;"
                                        title="Clone dataset"
                                        onclick="
                                        GFFOBJ.mw.option('',
                                            'Are you sure to clone the dataset?',
                                            GFFOBJ.clonedataset,
                                            ['`+b[i]._id+`']);
                                        "
                                    >
                                        <i  class="fa fa-clone fa-lg"
                                            style="color: #1479d9;"
                                        ></i>
                                    </a>
                                    <a href="#" class="btn btn-light"
                                        style="padding: 2px;"
                                        title="Download dataset"
                                        onclick="
                                            GFFOBJ.downloaddataset('`+ b[i]._id + `');
                                        "
                                    >
                                        <i class="fa fa-download fa-lg"
                                            style="color: #f5a742;"
                                        ></i>
                                    </a>
                                    `+ ownclt + `
                                </div>
                        </td>`;
            stringhtml += '</tr>';
        }
        stringhtml += '</tbody></table>';

        gelem("idtabledatasets").innerHTML = stringhtml;
    };

    this.getdatasetname = function () {
        var ob = new ServiceData("get data set name");
        ob.in.argms["type"] = 4;
        ob.in.argms["file"] = self.datafileselected;
        ob.event = function () {
            var txtnamedb = this.ou;
            if (self.isnamedbedited || self.multiuser==0){
                txtnamedb += `&nbsp;<i class="fas fa-edit fa-sm"></i>`;
            }
            gelem('iddatasettitle').innerHTML = txtnamedb;
            gelem('iddatasettitle').setAttribute("title","Change name");

            gelem('idtxtsearch').value = this.ou;
            gelem('idtextdbname').value = this.ou;
            self.datafileselectedname = this.ou;

            gelem('layoutchangenametxtdb').style.display = 'none';
            gelem('iddatasettitle').style.display = 'block';
        };
        ob.start();
    };

    this.uploadfiledata = function () {
        var fi = document.getElementById('fileu');
        var file = fi.value;
        var reg = /(.*?)\.(csv|zip)$/;
        if (file.match(reg)) {
            var fsize = fi.files.item(0).size;
            var z = Math.round((fsize / 1024));
            if (z <= 71680) {
                var ob = new DataIO();
                ob.argms.type = 3;
                gelem('datafromupload').value = JSON.stringify(ob);

                //showloading
                MOPRO.show("uploading file");
                gelem('formupload').submit();        
                gelem('fileu').value = "";        
            }
            else{
                self.mw.alert("","please use files up to 70MB");
            }
        }
        else{
            self.mw.alert("","Please use .csv and zip files");
        }
        fi.value = "";
    };

    this.loadfilecsv = function () {
        //d3.csv("http://localhost:8888/data/"+datafileselected+"/transform.csv", function(datai) {
        d3.csv("./data/" + self.datafileselected + "/transform.csv", function (datai) {
            self.dataload = datai;
        });
    };

    this.padmove = function (wwwd) {
        var idviewpad = "#idpadmover";
        d3.select(idviewpad).selectAll("svg").remove();

        var xx = 0;
        var yy = 0;
        var dragpad = d3.drag()
            .on("start", function () {
                xx = d3.event.x;
                yy = d3.event.y;
            })
            .on("drag", function (d, i) {
                coordination(d3.event.x, d3.event.y);
            })
            .on("end", function () {

            });

        var svgpad = d3.select(idviewpad).append("svg")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", wwwd)
            .attr("height", wwwd)
            .append("rect")
            .attr("width", wwwd + "px")
            .attr("height", wwwd + "px")
            .attr("fill", "#ffdb56")
            .call(dragpad)
            .on("click", function () {

            });

        svgpad.append("g");

        function coordination(x, y) {
            if (x >= 0 && y >= 0 && x < wwwd && y < wwwd) {
                var xi = x - xx;
                var yi = y - yy;

                cx = (xi / wwwd) * 17.0;
                cy = (yi / wwwd) * 17.0;
                self.layoutfeatures.translatte(cx, cy);
            }
        }
    };

    this.plotpaiercorrelate = function () {
        if (self.featureselected.length >= 2) {
            d3.select("#visp").selectAll("svg").remove();
            chart_correlation("#visp", self.dataload, self.featureselected, gvalue('target'));
        }
        //MOPRO.hide();
    };
    
/*     this.featureCheck = function (feid, feva) {
        var ob = new ServiceData("unselected feature");
        ob.in.argms["type"] = 22;
        ob.in.argms["file"] = self.datafileselected;
        ob.in.argms["feid"] = feid;
        ob.in.argms["feva"] = feva;
        ob.event = function () {
            response = this.ou;
            if (response["response"] != 0) {

            }
        };
        ob.start();
    }; */


    this.getUnselecteFeatures = function () {
        var ob = new ServiceData("get unselected features");
        ob.in.argms["type"] = 22;
        ob.in.argms["file"] = self.datafileselected;
        //console.log("ob.in", ob.in);
        ob.event = function () {
            //self.USFOBJ.unselectedfeatures = this.ou["response"];
            //console.log("zzzzthis.ou", this.ou);
            self.unselectedfeids = this.ou;
            self.USFOBJ.init();
            self.USFOBJ.load();
            self.USFOBJ.print();
        };
        ob.start();
    };





    this.dropdataset = function (iddb) {
        var ob = new ServiceData("drop dataset");
        ob.in.argms["type"] = 10;
        ob.in.argms["file"] = iddb;
        ob.event = function () {
            response = this.ou;
            self.loadlayoutdbs();
        };
        ob.start();
    };

    this.sharedataset = function (iddb) {
        var ob = new ServiceData("share dataset");
        ob.in.argms["type"] = 8;
        ob.in.argms["file"] = iddb;
        ob.event = function () {
            response = this.ou;
            self.loadlayoutdbs();
        };
        ob.start();
    };

    this.unsharedataset = function (iddb) {
        var ob = new ServiceData("unshare dataset");
        ob.in.argms["type"] = 9;
        ob.in.argms["file"] = iddb;
        ob.event = function () {
            response = this.ou;
            self.loadlayoutdbs();
        };
        ob.start();
    };

    this.clonedataset = function (iddb) {
        var ob = new ServiceData("clone dataset");
        ob.in.argms["type"] = 7;
        ob.in.argms["file"] = iddb;
        ob.event = function () {
            response = this.ou;
            self.loadlayoutdbs();
        };
        ob.start();
    };

    this.downloaddataset = function (iddb) {
        datin = new DataIO();
        datin.argms["type"] = 12;
        datin.argms["file"] = iddb;
        var url = "./query?data=" + JSON.stringify(datin);
        window.location.href = url;
    };

    this.export2dprojwhole = function () {
        /* datin = new DataIO();
        datin.argms["type"] = 16;
        datin.argms["file"] = self.datafileselected;
        var url = "./query?data=" + JSON.stringify(datin);
        window.location.href = url; */
    };

    this.export2dprojselected = function () {
        /* datin = new DataIO();
        datin.argms["type"] = 16;
        datin.argms["file"] = self.datafileselected;
        var url = "./query?data=" + JSON.stringify(datin);
        window.location.href = url; */
    };

    this.exportfeat2datafile = function () {   
        if(Object.keys(self.datagff.layoutfeature.graph.nodes).length){
            //MOPRO.show("download .data file");
            datin = new DataIO();
            datin.argms["type"] = 17;
            datin.argms["file"] = self.datafileselected;
            var url = "./query?data=" + JSON.stringify(datin);
            window.location.href = url;
            /*
            window.open(
                url,
                '_blank'
                );
            */
            //MOPRO.hide();
            
            /* setTimeout( function () {

            }
            , 1); */

        }
    };

    this.updatedatasetname = function (e, newname) {
        newname = trim(newname);
        if (e.keyCode === 13) {
            if (self.datafileselected != "" && newname != "") {
                var ob = new ServiceData("update dataset name");
                ob.in.argms["type"] = 6;
                ob.in.argms["file"] = self.datafileselected;
                ob.in.argms["newname"] = newname;
                ob.event = function () {
                    response = this.ou;
                    self.getdatasetname();
                };
                ob.start();
            }
        }
    };

    this.logout = function () {
        window.location.href = "./logout";
    };

    this.changepassword = function () {
        pass = gelem("ipassword").value;
        npass = gelem("inpassword").value;
        rpass = gelem("inpasswordr").value;
        if (pass != "" && npass != "" && rpass != "") {
            if (npass == rpass) {
                var ob = new ServiceData("change password");
                ob.in.argms["type"] = 11;
                ob.in.argms["password"] = pass;
                ob.in.argms["newpassword"] = npass;
                ob.event = function () {
                    response = this.ou;
                    if (response["response"] == 1) {
                        self.mw.alert("","The new password was saved!", self.logout);
                    }
                };
                ob.start();
            }
        }
    };

    this.silhouette = function () {
        var status = "compute silhouette";
        var ob = new ServiceData(status);
        ob.in.argms["type"] = 13;
        ob.in.argms["file"] = self.datafileselected;
        ob.in.argms["statusval"] = status;
        ob.event = function () {
            response = this.ou;
            gelem("topleft2").innerHTML = "SILHOUETTE: " + response;
        };
        ob.start();
    };


    this.changeintarget = function () {
        //console.log("self.featureselectedWWWWWWWWWW::", self.featureselected);
        if (self.intargetaction) {
            self.intarget = true;
            self.intargetaction = false;
            if (self.featureselected.length > 0) {
                var istargetinclude = false;
                var taindex = self.auxfeatureselectedf[self.target];
                for (var e of self.featureselected) {
                    if (e == taindex) {
                        istargetinclude = true;
                        break;
                    }
                }
                if (istargetinclude == false) {
                    self.featureselected.push(taindex);
                }
                if (self.layoutfeatures != null) {
                    self.layoutfeatures.highlightforce(self.featureselected);
                }
            }
        }
        else {
            self.intarget = false;
            self.intargetaction = true;
            ref = [];
            taindex = self.auxfeatureselectedf[self.target];
            for (var i in self.featureselected) {
                e = self.featureselected[i];
                if (e != taindex) {
                    ref.push(e);
                }
            }
            self.featureselected = ref;
            //console.log("self.featureselected", self.auxfeatureselectedf, self.featureselected);
            if (self.layoutfeatures != null) {
                self.layoutfeatures.highlightforce(self.featureselected);
            }
        }
        self.changeintargetbtn();
    };
    
    this.changeintargetbtn = function () {
        var el = gelem("btnintarget");
        if (self.intargetaction) {
            el.style.backgroundColor = '#f1f1f1';
        }
        else{
            el.style.backgroundColor = '#ffd70f';
        }
    };

    this.getNode = function(i){
        //return this.dataoutfeature.layoutfeature["graph"].nodes[i];
        return self.datagff.layoutfeature["graph"].nodes[i];
    };

    /* 
    //listfeatures
    this.showstatuspanel = function(ou){
        self.loadingverification();
        //self.shifflayoutcontrols("idstatedataset");
        //gelem("idstatusval").innerHTML = ou["statusval"];
        
    };
    */


    this.shifflayoutcontrols = function (el) {
        gelem('layoutchangenametxtdb').style.display = 'none';
        gelem('iddatasettitle').style.display = 'none';

        //fullScreen();
        gelem("idchangepasswordlayout").style.display = "none";
        gelem("iduserlayout").style.display = "none";
        gelem("iddatasetlayout").style.display = "none";
        gelem("idaboutlayout").style.display = "none";
        gelem("mainlayout").style.display = "none";
        //gelem("idstatedataset").style.display = "none";
        
        gelem(el).style.display = "block";

        if (el=="mainlayout"){
            gelem('layoutchangenametxtdb').style.display = 'none';
            gelem('iddatasettitle').style.display = 'block';
        }
    };

    this.showedgebundlingX = function () {
        if (self.layoutfeatures.isupdatebundling) {
            setTimeout( function () {
                            MOPRO.show("making edge bundling");
                        }
                        , 1);
        }
        setTimeout(self.layoutfeatures.showedgebundling, 500);
    };

    this.main = function () {
        //setInterval(self.loadingverification, 3000);
        

        MOPRO.main();
        self.mw.main();
        
        self.loaddatasets();
        
        self.shifflayoutcontrols("iddatasetlayout");
        self.padmove(100);

        gelem("vis").style.width = self.lwidth + "px";
        gelem("vis").style.height = self.lwidth + "px";
        gelem("vis").style.minHeight = self.lwidth + "px";
        gelem("vis").style.minWidth = self.lwidth + "px";
        gelem("vis").style.maxHeight = self.lwidth + "px";
        gelem("vis").style.maxWidth = self.lwidth + "px";

        gelem("visp").style.width = self.lwidth + "px";
        gelem("visp").style.height = self.lwidth + "px";
        gelem("visp").style.minHeight = self.lwidth + "px";
        gelem("visp").style.minWidth = self.lwidth + "px";
        gelem("visp").style.maxHeight = self.lwidth + "px";
        gelem("visp").style.maxWidth = self.lwidth + "px";

        gelem("idlayout1bar").style.maxHeight = self.lwidth + "px";
        gelem("idlayout1bar").style.minHeight = self.lwidth + "px";

        gelem("idlayout2bar").style.maxHeight = self.lwidth + "px";
        gelem("idlayout2bar").style.minHeight = self.lwidth + "px";

        if (self.adminid==1 && self.multiuser==1){
            gelem("iduserlistop").style.display = "block";
        }
        

        document.addEventListener('keydown', (event) => {
            self.setkey(event);
        });
        document.addEventListener('keyup', (event) => {
            self.hidekey();
        });
        self.hidekey();

        CCTT.main();

    };

    this.fullScreen = function () {
        var isInFullScreen = (document.fullscreenElement && document.fullscreenElement !== null) ||
        (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
        (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
        (document.msFullscreenElement && document.msFullscreenElement !== null);

        if (!isInFullScreen) {
            self.setfullScreen();
        } else {
            self.exitfullScreen();
        }
    };

    this.setfullScreen = function () {
        var docElm = document.documentElement;
        if (docElm.requestFullscreen) {
            docElm.requestFullscreen();
        } else if (docElm.mozRequestFullScreen) {
            docElm.mozRequestFullScreen();
        } else if (docElm.webkitRequestFullScreen) {
            docElm.webkitRequestFullScreen();
        } else if (docElm.msRequestFullscreen) {
            docElm.msRequestFullscreen();
        }
    };

    this.exitfullScreen = function () {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    };
    
    this.save_as_svg = function (idp,title) {
        $.get("./lib/style.css", function (cssContent) {
            d3.select(idp).select("svg")
                .append("defs").append("style").attr("type", "text/css").html(cssContent);

            var html = d3.select(idp).select("svg")
                .attr("version", 1.1)
                .attr("xmlns", "http://www.w3.org/2000/svg")
                .node().parentNode.innerHTML;

            var imgsrc = 'data:image/svg+xml;base64,' + btoa(html);

            gelem("svgdataurl").href = "";
            gelem("svgdataurl").download = self.datafileselectedname+"_"+title;

            gelem("svgdataurl").href = imgsrc;
            gelem("svgdataurl").click();
        });
    };

    this.featureselectionbyfiltername = function (txt2filter) {
        featsel = [];
        txtfilter = txt2filter.split('&&');

        nfilter = [];
        for (var wd of txtfilter) {
            wd = trim(wd);
            wd = self.lfenamesindex[wd];
            if (wd in self.auxfeatureselectedf) {
                index = self.auxfeatureselectedf[wd]
                featsel.push(index);
                nfilter.push(self.datagff.fenames[wd]);
            }
        }
        if (featsel.length > 0) {
            self.featureselected = featsel;
            self.layoutfeatures.highlightforce(self.featureselected);
            gelem("fesenanetxt").value = nfilter.join('&&');
        }
    };

    this.setToolpiltex = function (ex, ey, txt) {
        gelem("floatdiv").innerHTML = "";
        gelem('floatdiv').style.left = (ex + 2) + "px";
        gelem('floatdiv').style.top = (ey - 23) + "px";
        gelem('floatdiv').style.display = "block";
        gelem("floatdiv").innerHTML = txt;
    };

    this.hideToolpiltex = function () {
        gelem("floatdiv").style.display = "none";
        gelem("floatdiv").innerHTML = "";
    };

    this.setkey = function (event) {
        if (event.ctrlKey || event.altKey ) {
            self.ispresskey = 1;
            //console.log("event.ctrlKey || event.altKey");
        }
        else if (event.shiftKey) {
            self.ispresskey = 2;
            //console.log(event.shiftKey);
        }

    };
    this.hidekey = function () {
        self.ispresskey = 0;
        //console.log("self.ispresskey", self.ispresskey);
    };

    this.viewFeaturesSelected = function (opt) {
        let datfe = [];
        let maxv = -1;
        let title = "";
        if (opt == "feature") {
            title = self.datagff.configfeature.relevance;
            for (var i of self.featureselected) {
                var item = self.getNode(i);
                score = self.datagff.configfeature.nodes[item.name].weight;
                datfe.push({
                    "label": item.label,
                    "color": VertexColorF(score),
                    "score": score,
                    "scorenorm": score,
                });
                if (score > maxv) {
                    maxv = score;
                }
            }

            for (var i in datfe) {
                datfe[i]["scorenorm"] = datfe[i]["scorenorm"] / maxv;
            }
            if (datfe.length>0){
                gelem("featselectfeaturetitle").innerHTML = title;
                chart_circularhist(self, datfe, "#featselectfeaturecontent", 500, 500);
            }
        }
        else if (opt == "instance") {
            //console.log("WW", self.datagff);
            title = self.datagff.configinstance.relevance;
            var featt = self.datagff.configinstance.featureselected;
            for (var e of featt) {
                var i = self.auxfeatureselectedi[e];
                var item = self.datagff.configinstance.nodes[i];
                //console.log("self.datagff.configinstance", self.datagff.configinstance);
                score = item.weight;
                datfe.push({
                    "label": item.label,
                    "color": VertexColorF(score),
                    "score": score,
                    "scorenorm": score,
                });
                if (score > maxv) {
                    maxv = score;
                }
            }
            for (var i in datfe) {
                datfe[i]["scorenorm"] = datfe[i]["scorenorm"] / maxv;
            }
            if (datfe.length>0){
                gelem("featselectinstancetitle").innerHTML = title;
                chart_circularhist(self, datfe, "#featselectinstancecontent", 500, 500);
            }
        }
    };

    this.hideFeaturesSelected = function (opt) {
        if (opt == "feature") {
            gelem('featselectfeature').style.display = 'none';
        }
        else if (opt == "instance") {
            gelem('featselectinstance').style.display = 'none';
        }
    };

    this.initradiallayout = function () {
        self.layoutfeatures.initradiallayout();
    };

    this.changecolorstable = function (c) {
        if(self.colorstableshitttype==1){
            CCTT.id = c;
            VertexColorF = CCTT.interpolate();

            chart_palettecolors(self.layoutfeatures.selectbythreshold,
                "seq1", 20, self.lwidth-20, VertexColorF);

            self.layoutfeatures.vertexcolorf = VertexColorF;
            self.layoutfeatures.updatecolors();
        }
        else if(self.colorstableshitttype==2){
            CCTT.id = c;
            EdgeColorF = CCTT.interpolate();
            chart_histogram(self.setToolpiltex,
                self.hideToolpiltex,
                self.layoutfeatures.updatelinkoption,
                "seqedgehist", self.lwidth, EdgeColorF, self.datagff.layoutfeature["edgehist"]);

            self.layoutfeatures.edgecolorf = EdgeColorF;
            self.layoutfeatures.drawedges();
        }
        else if(self.colorstableshitttype==3){
            CCTT.id = c;
            ProjectionColorF = CCTT.interpolate();

            self.layoutinstance.projectioncolorf = ProjectionColorF;
            self.layoutinstance.updatecolors();
        }
    };

    this.settarget = function () {
        self.target = parseInt(gelem("target").value);
        self.USFOBJ.print();
    }

/*     this.loadselectfeatureid = function () {
        loadselectfeatureid
        for (var item of selfgff.datagff.fenames) {
            self.unselectedfeatures.push({
                                            "name": item,
                                            "id": i,
                                            "value": 0,
                                        });
            i++;
        }
    };

    gelem("idselectedfebt").onclick = function(){
        if(gelem("idselectedfebt").value==1){
            gelem("idselectidcont").style.display = "block";
            gelem("idselectedfebt").value = 0;
        }
        else{
            gelem("idselectidcont").style.display = "none";
            gelem("idselectedfebt").value = 1;
        }    
    }; */


}


/**
 * Others auxiliar methods
 */
/* $(document).ready(function () {
    $('#idtextdbname').focusout(function () {
        GFFOBJ.getdatasetname();
        GFFOBJ.fullScreen();
    });
}); */
function opendatsetparser() {
    //self.fullScreen();
    GFFOBJ.loadlayoutdbs();
}
function mwalert(title, txtbody) {
    //self.fullScreen();
    GFFOBJ.mw.alert(title, txtbody);
}
/* function showloading(title, txtbody) {
    //self.fullScreen();
    MOPRO.show(title);
} */


/***
* function: Load Object recursively
*/
function loadObject(work, obj, list, count, dataset, functpro, functend, functbusy, type) {
    if(count<list.length){
        //MOPRO.status((count*100.0)/list.length);
        let ob = new ServiceData(work+" ("+(count+1)+" of "+list.length+")");
        ob.in.argms["type"] = type;
        ob.in.argms["file"] = dataset;
        ob.in.argms["data"] = list[count];
        ob.event = function () {
            /* console.log("error loadataset", this); */
            switch (this.ou["statusopt"]) {
                // ok, free, ready
                case 0:
                    //console.log("out", out, this.in.argms["data"]);
                    //update obj
                    functpro.apply(this, [obj, this.ou]);

                    /* var timer = setTimeout(
                        function(){
                        },1000); */
                    count++;
                    loadObject(work, obj, list, count, dataset, functpro, functend, functbusy, type);
                    break;
                // working/busy
                case 1:
                    functbusy.apply(this,[this.ou]);
                    break;
                // error
                case 2:
    
                    break;
                //default:
                    
            };
        };
        ob.start();
    }
    else{
        //execute function when end
        functend.apply(this, [obj]);
    }
};
