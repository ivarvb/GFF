/*
# Author: Ivar Vargas Belizario
# Copyright (c) 2021
# E-mail: ivar@usp.br
*/

function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }
    return true;
}
function chunk(arr, size) {
    var myArray = [];
    for(var i = 0; i < arr.length; i += size) {
      myArray.push(arr.slice(i, i+size));
    }
    return myArray;
}
function gelem(id) {
    return document.getElementById(id);
}
function gelen(na) {
    return document.getElementsByName(na);
}
function gvalue(id) {
    return document.getElementById(id).value;
}
function trim(str) {
    return str.replace(/^\s+|\s+$/g, "");
}
function ffocus(v) {
    gelem(v).focus();
}
function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
function removechilds(elem) {
    if (elem.hasChildNodes){
        for (var e of elem.childNodes){
            elem.removeChild(e);
        }
    }
}
function setDict(dat, arr, val) {
    //console.log("arr, val", arr, val);
    if(arr.length==1){
        av = arr.length == 1 ? val : {};
        k = arr[0];
        if (isEmpty(dat) || !(k in dat)){
            dat[k]= av;
        }
    }
    else if(arr.length>1){
        av = arr.length == 1 ? val : {};
        k = arr[0];
        if (isEmpty(dat) || !(k in dat)){
            dat[k]= av;
        }
        dat = dat[k];
        for (var i=1; i<arr.length; ++i){
            k2 = arr[i];
            av = (i+1)==arr.length ? val : {};
            if (isEmpty(dat)){
                dat[k2] = av;
                dat = dat[k2];
            }
            else if (k2 in dat){
                dat = dat[k2];
            }
            else{
                dat[k2] = av;
                dat = dat[k2];
            }
        }
    }
};




/**
 * Class: Monitor Process
 */
function MonitorProcess(selff) {
    var self = this;

    this.auto = false;
    //this.auto = true;
    this.idcont = "idloading";
    this.idtxt = "idloadingtxt";
    this.idstatus = "idloadingload";


    this.show = function(text) {
        gelem(self.idcont).style.display = "block";
        gelem(self.idtxt).innerHTML = text+"";
    }
    this.status = function(load) {
        gelem(self.idstatus).style.width = load+"%";
    }
    this.hide = function () {
        if(selff.memprocess==null){
            gelem(self.idcont).style.display = "none";
            //gelem(self.idstatus).style.width = "0%";
        }
    }    




    this.processkey = 0;
    this.process = {};
    this.toolstatus = [100, 95, 70, 40, 20, 10, 1];

    this.pushprocess = function(pname) {
        self.processkey++;
        var ps = self.processkey;

        self.process[ps] = pname;

        self.show(pname);
        if (self.auto){
            self.status(self.computestatus());
        }
        //console.log("push: ", ps);

        return ps;
    };

    this.popprocess = function(p) {
        delete self.process[p];
        //console.log("delete: ", p, Object.keys(self.process).length, self.process);
        
        if (self.auto){
            self.status(self.computestatus());
        }

        if (Object.keys(self.process).length == 0) {
            self.hide();
        }
    };

    this.computestatus = function() {
        var size = Object.keys(self.process).length;
        var load = 1;
        if (size<=7){
            load = self.toolstatus[size];
        } 
        return load;
    };


    this.main = function () {
        var win = `
            <div>
                <div style="position: absolute; 
                    width: 360px;
                    min-width:360px;
                    max-width: 360px;
                    top: 40%;
                    left: 50%;
                    /*margin-top: -40px;*/
                    margin-left: -180px;
                    z-index: 20;
                    text-align: center;
                    "
                >
        <!-- 
                    <div class="d-flex justify-content-center">
                        <div class="spinner-border text-danger" 
                            style="width: 160px; height: 160px;
                            " 
                            role="status"
                        >
                            <span class="sr-only">Loading...</span>
                        </div>
                    </div>
                    <div style="height: 10px;"></div>
        -->
                    <div style="
                        background-color: #494882;
                        padding: 6px; 
                        border: 1px solid #453a5e;
                        border-radius: 2px;
                        "
                    >
                        <div id="`+self.idtxt+`"
                            style="
                                z-index: 23;
                                color:#fff;
                                text-align: center;
                                font-size: 12px;
                                vertical-align: bottom;
                            "
                        >
                            Loading ...
                        </div>
                        <div style="height:3px"></div>
                        <div class="progress">
                            <div id="`+self.idstatus+`" class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="100" aria-valuemin="100" aria-valuemax="100" style="width: 100%">
                            </div>
                        </div>
                    </div>
                </div>
            </div>        
        `;

        var container = document.createElement("DIV");
        container.setAttribute("id",self.idcont);
        container.setAttribute("style", `display: block;
                                    position: fixed;
                                    width: 100%;
                                    height: 100%;
                                    left: 40px;
                                    top: 0;
                                    background: rgba(21, 22, 40, 0.9);
                                    z-index: 10;`);
        container.innerHTML = win;
        
        //removechilds("idmodelcontent");
        //gelem("idmodelcontent").appendChild(container); 
        document.body.appendChild(container);
    };

    //this.main();
}








/**
 * Class: Monitor Process
 */
 function ElementMP(p) {
    this.name = -1;
    this.next = -1;
    this.process = p;
 }

 function MProcess() {
    var self = this;
    this.idcont = "idloadingMP";
    this.idtxt = "idloadingtxtMP";
    this.idstatus = "idloadingloadMP";


    this.process = {};
    this.count = 0;
    this.key = -1;

    this.show = function(text) {
        gelem(self.idcont).style.display = "block";
        gelem(self.idtxt).innerHTML = text+"";
    };
    
    this.hide = function () {
        gelem(self.idcont).style.display = "none";
    };

    this.insert = function (e) {
        self.count += 1;
        id = self.count;
        e.id = id;
        e.next = id+1;
        self.process[self.count] = e;
        return id;
    };

    this.delete = function (e) {
        p = self.process[e]
        p.status = 2;
        self.key = p.next;
        delete self.process[e];
    };   

    this.execute = function () {
        if (Object.keys(self.process).length > 0 && self.key>0) {
            p = self.process[self.key];
            self.show(p.name);
            if (p.status==0){
                p.status=1;
                p.process.apply(this);
            }
        }
        else{
            self.hide();
        }
    };

    this.clean = function () {
        self.process={};
        self.count = 0;
    };

    this.main = function(){
        setInterval(self.execute, 3000);
        var win = `
            <div>
                <div style="position: absolute; 
                    width: 360px;
                    min-width:360px;
                    max-width: 360px;
                    top: 40%;
                    left: 50%;
                    /*margin-top: -40px;*/
                    margin-left: -180px;
                    z-index: 20;
                    text-align: center;
                    "
                >
                    <div style="
                        background-color: #494882;
                        padding: 6px; 
                        border: 1px solid #453a5e;
                        border-radius: 2px;
                        "
                    >
                        <div id="`+self.idtxt+`"
                            style="
                                z-index: 23;
                                color:#fff;
                                text-align: center;
                                font-size: 12px;
                                vertical-align: bottom;
                            "
                        >
                            Loading ...
                        </div>
                        <div style="height:3px"></div>
                        <div class="progress">
                            <div id="`+self.idstatus+`" class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="100" aria-valuemin="100" aria-valuemax="100" style="width: 100%">
                            </div>
                        </div>
                    </div>
                </div>
            </div>        
        `;

        var container = document.createElement("DIV");
        container.setAttribute("id",self.idcont);
        container.setAttribute("style", `display: block;
                                    position: fixed;
                                    width: 100%;
                                    height: 100%;
                                    left: 40px;
                                    top: 0;
                                    background: rgba(21, 22, 40, 0.9);
                                    z-index: 10;`);
        container.innerHTML = win;
        
        //removechilds("idmodelcontent");
        //gelem("idmodelcontent").appendChild(container); 
        document.body.appendChild(container);
    };
}


