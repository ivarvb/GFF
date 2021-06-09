/*
# Author: Ivar Vargas Belizario
# Copyright (c) 2021
# E-mail: ivar@usp.br
*/

function UnselectedFeatures(btnid, contid, selfgff) {
    let self = this;
    this.unselectedfeatures = [];
    this.btn = btnid; 
    this.layout = contid;
    this.layoutlist = "idunselectedfelist";
    this.textsearch = "idunselectedtxt";
    this.checkboxnameall = "checkboxtoggleallus";
    this.checkboxname = "idunselectedname";
    this.backsearch = [];
    this.isopen = false;

    this.init = function(){
        self.close();
        gelem(self.textsearch).value = ""
        gelem(self.checkboxnameall).checked = false;
        self.unselectedfeatures = [];
        var i = 0;
        for (var item of selfgff.datagff.fenames) {
            self.unselectedfeatures.push({
                                            "name": item,
                                            "id": i,
                                            "value": 0,
                                        });
            i++;
        }
        self.backsearch = self.unselectedfeatures;
        gelem(self.btn).onclick = function(){
            self.show();
        };

        gelem(self.textsearch).onkeyup = function(){
            self.search(gelem(self.textsearch).value);
        };
        
    };

    this.show = function() {
        if(self.isopen){
            gelem(self.layout).style.display = "block";
            self.isopen = false;
        }
        else{
            gelem(self.layout).style.display = "none";
            self.isopen = true;
        }
    };

    this.open = function() {
        self.isopen = true;
        self.show();
    };

    this.close = function() {
        self.isopen = false;
        self.show();
    };

    this.search = function (txt) {
        var txt = trim(txt);
        gelem(self.layoutlist).innerHTML = "";
        self.backsearch = [];
        if (txt != "") {
            self.backsearch = self.unselectedfeatures.filter(item => item.name.toLowerCase().indexOf(txt) > -1);
        }
        else {
            self.backsearch = self.unselectedfeatures;
        }
        self.print();
    };

    this.print = function(){
        self.datagff
        //var idt = selfgff.lfenamesindex[gelem('target').value];
        var idt = gelem('target').value;
        //console.log("gelem('target').valueX", idt, gelem('target').value);
        self.setChecked(idt, 0);
        
        gelem(self.layoutlist).innerHTML = "";



        var container = document.createElement("DIV");
        var divs = document.createElement("DIV");
        divs.setAttribute("style", "height: 5px;");
        container.appendChild(divs);

        for (var item of self.backsearch){
            cktxt = false;
            if (item.value==1){
                cktxt=true;
            }

            let label = document.createElement("LABEL");
            label.setAttribute("for", "vxs1"+item.id);
            label.setAttribute("style", "width: 100%; padding:0; margin:0");
            label.setAttribute("class","container");

            /* 
            label.onmouseover  = function(e){
                self.setToolpiltex(this, e);
            };
            label.onclick  = function(e){
                self.setToolpiltex(this, e);
            };
            label.onmouseout = function(){
                selfgff.hideToolpiltex();
            };
            */

            let input = document.createElement("INPUT");
            input.setAttribute("type", "checkbox");
            input.setAttribute("id", "vxs1"+item.id);
            input.setAttribute("name", self.checkboxname);
            input.setAttribute("value", item.id);
            //input.setAttribute("title", item.name);
            input.checked = cktxt;
            input.onclick = function(){
                //if (this.checked == true && gelem('target').value != this.title){
                if (this.checked == true && gelem('target').value != this.value){
                        self.setChecked(this.value, 1);
                }
                else{
                    self.setChecked(this.value, 0);
                    this.checked = false;
                }
            };
            let checkmark = document.createElement("SPAN");
            checkmark.setAttribute("class","checkmark");

            label.appendChild(input);
            label.appendChild(checkmark);
            label.appendChild(document.createTextNode("\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0"+item.name));

            let div = document.createElement("DIV");
            div.setAttribute("class","resultssearch");
            //div.setAttribute("style", "border: solid 1px #ff0000;");
            div.appendChild(label)

            container.appendChild(div);
        }
        var le = gelem(self.layoutlist).lastChild;
        if (le!=null){
            gelem(self.layoutlist).removeChild(gelem(self.layoutlist).lastChild);
        }
        gelem(self.layoutlist).appendChild(container);
    };

    this.setAllChecked = function(ischecked){
        if(self.backsearch.length>0){
            var checkboxes = gelen(self.checkboxname);
            for(var checkbox in checkboxes){
                var elm = gelen(self.checkboxname).item(checkbox);
                var id = elm.value;
                //var nam = self.unselectedfeatures[id].name;
                if (ischecked && gelem('target').value != id){
                //if (ischecked && selfgff.datagff.fenames[gelem('target').value] != nam){
                    self.setChecked(id, 1);
                    elm.checked = ischecked;
                }
                else{
                    self.setChecked(id, 0);
                    elm.checked = false;
                }
            }
        }
    };

    this.setChecked = function(i, value){
        //console.log("i, value", i, value);
        self.unselectedfeatures[i].value = value;
        //selfgff.featureCheck(self.unselectedfeatures[i].id, value);
    };
    
    this.load = function(){
        for(var id of selfgff.unselectedfeids){
            self.setChecked(id, 1);
        }
    };

    this.at = function(i){
        return self.unselectedfeatures[i];
    };

    this.getUnselected = function(){
        //var idt = selfgff.lfenamesindex[gelem('target').value];
        var idt = gelem('target').value;
        this.setChecked(idt, 0);

        var rest = [];
        for (var e of self.unselectedfeatures){
            if (e.value==1){
                rest.push(e.id);
            }
        }
        return rest;
    };

    this.setToolpiltex = function(el, e) {
        var idc = el.getAttribute("for");
        var isc = gelem(idc).checked;
        //var iti = gelem(idc).title;
        ///console.log(idc);
        if (isc){
            selfgff.setToolpiltex(
                e.clientX, e.clientY,
                "Select feature "
            );
        }
        else{
            selfgff.setToolpiltex(
                e.clientX, e.clientY,
                "Unselect feature "
            );
        }
    };
    this.setToolpiltexToggle = function(e) {
        var ch = gelem("checkboxtoggleallus").checked;
        if(ch){
            selfgff.setToolpiltex(
                e.clientX, e.clientY,
                "Select features"
            );            
        }
        else{
            selfgff.setToolpiltex(
                e.clientX, e.clientY,
                "Unselect features"
            );            
        }    
    };

    this.main = function () {
        var container = gelem(self.layout);
        removechilds(container);
        container.setAttribute("style",`position: absolute;
                                background-color: #fff;
                                max-width: 240px;
                                min-width: 240px;
                                border: solid 1px #ccc;
                                text-align: left;
                                z-index: 9;`);

        var div1 = document.createElement("DIV");
        div1.setAttribute("style",`padding: 4px;`);

            var search = document.createElement("INPUT");
            search.setAttribute("id",`idunselectedtxt`);
            search.setAttribute("type",`text`);
            search.setAttribute("class",`form-control form-control-sm`);
            search.setAttribute("placeholder","Search");
            search.setAttribute("style","width: 100%;");


        div1.appendChild(search);


        var div2 = document.createElement("DIV");
        div2.setAttribute("class","resultssearch");
        div2.setAttribute("style", `border-bottom: solid 1px #ccc;`);
            var label = document.createElement("LABEL");
            label.setAttribute("class","container");
            label.setAttribute("for","checkboxtoggleallus");
            label.setAttribute("style", "width: 100%; padding:0; margin:0");
                var check = document.createElement("INPUT");
                check.setAttribute("type","checkbox");
                check.setAttribute("id","checkboxtoggleallus");
                check.setAttribute("style","padding:0; margin: 0;");

                check.onclick = function() {
                    self.setAllChecked(this.checked);
                };            
                let checkmark = document.createElement("SPAN");
                checkmark.setAttribute("class","checkmark");
        
        label.onmousemove  = function(e){
            self.setToolpiltexToggle(e);
        };
        label.onclick  = function(e){
            self.setToolpiltexToggle(e);
        };
        label.onmouseout = function(){
            selfgff.hideToolpiltex();
        };
            
        label.appendChild(check);
        label.appendChild(checkmark);
        label.appendChild(document.createTextNode("\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0Toggle All"));
        div2.appendChild(label);


        var div3 = document.createElement("DIV");
        div3.setAttribute("id","idunselectedfelist");
        div3.setAttribute("style", `min-height: 200px; max-height: 200px;
                                    overflow: auto; text-align: left;`);
        container.appendChild(div1);
        container.appendChild(div2);
        container.appendChild(div3);
    };
    self.main();
}
//let USFOBJ = new UnselectedFeatures(GFFOBJ);