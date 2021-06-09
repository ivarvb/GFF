/*
# Author: Ivar Vargas Belizario
# Copyright (c) 2020
# E-mail: ivar@usp.br
*/

function ModalWindow() {
    let self = this;

    this.title = "";
    this.txt = "";
    this.functarg = [];
    this.opt = 0;

    this.alert = function(title, txt, funct=null, functarg=null){
        self.title = title;
        self.txt = txt;
        self.funct = funct;
        self.functarg = functarg;
        self.opt = 0;
        self.show();
    };

    this.option = function(title, txt, funct, functarg){
        self.title = title;
        self.txt = txt;
        self.funct = funct;
        self.functarg = functarg;
        self.opt = 1;
        self.show();
    };

    this.callfunct = function(){
        //this.funct(this.functarg);
        if (this.functarg!=null){
            this.funct.apply(this, this.functarg);
        }
        else{
            this.funct.apply(this);
        }
    };

    this.show = function() {
        gelem("idmwcs").style.display = "none";
        gelem("idmwcn").style.display = "none";
        gelem("idmwok").style.display = "none";
        gelem("idmodalbuttons1").style.display = "none";
        gelem("idmodalbuttons2").style.display = "none";
        if(self.opt==0){
            gelem("idmwcs").style.display = "block";
            gelem("idmwicon").setAttribute("class", "fa fa-exclamation fa-4x");
            gelem("idmodalbuttons2").style.display = "block";
        }
        else if(self.opt==1){
            gelem("idmwcn").style.display = "block";
            gelem("idmwok").style.display = "block";
            gelem("idmwicon").setAttribute("class", "fa fa-question fa-4x");
            gelem("idmodalbuttons1").style.display = "block";
        }
        gelem("idwinmodaltitle").innerHTML = self.title;
        gelem("idwinmodalbody").innerHTML = self.txt;
        gelem("idwinmodal").style.display = "block";        
    };

    this.hide = function(){
        gelem("idwinmodaltitle").innerHTML = "";
        gelem("idwinmodalbody").innerHTML = "";
        gelem("idwinmodal").style.display = "none";
    };

/*     this.exaplefunc = function(a,b,c){
        console.log("abcc",a,b,c);
    }; */

    this.main = function() {
        var win = `
        <div  id="idwinmodal" 
            style="
            display: none;
            z-index: 99999999;
            position: fixed;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            background: rgba(21, 22, 40, 0.9);
            z-index: 10;
            "
        >
            <div
                class="d-flex justify-content-center"
                style="
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    margin: 0 auto;        
                    width: 360px;
                    height: 160px;
                    background-color:#e6e6e6;
                    border: 1px solid #999;
                    margin-top: -80px;
                    margin-left: -180px;
                    z-index: 10;
                "
            >
                <table style="height: 100%; width: 100%;">
                    <tr>
                        <td>
                            <div 
                                id="idwinmodaltitle"
                                style="
                                    position: absolute;
                                    width: 100%;
                                    margin-left: 4px;
                                    text-align: left;
                                "
                            >
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="height: 100%;">
                            <table style="width: 100%; height: 100%;">
                                <tr>
                                    <td style="width: 50px; vertical-align: middle;">
                                        <a class="nav-link" style="color: #ccc" href="#">
                                            <i id="idmwicon" class="fa fa-question fa-4x"></i>
                                        </a>                                    
                                    </td>
                                    <td style="width: 100%; vertical-align: middle;">
                                        <div id="idwinmodalbody" style="font-size: 12px;">
                                            Are you sure to delete the dataset?
                                        </div>                                                    
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: center; padding: 5px;">
                            <div id="idmodalbuttons1">
                                <div class="btn-group mr-2" role="group">
                                    <a id="idmwcn" class="btn btn-secondary"
                                        style="width: 80px;"
                                    >
                                        Cancel
                                    </a>
                                </div>
                                <div class="btn-group mr-2" role="group">
                                    <a id="idmwok" class="btn btn-primary"
                                        style="width: 80px;"
                                    >
                                        OK
                                    </a>
                                </div>
                            </div>
                            <div id="idmodalbuttons2">
                                <div class="btn-group mr-2" role="group">
                                    <a id="idmwcs" class="btn btn-primary"
                                        style="width: 80px;"
                                    >
                                        Close
                                    </a>
                                </div>
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
        </div>`;

        var container = document.createElement("DIV");       
        container.id = "ModalWindowsIdx45";
        container.innerHTML = win;
        document.body.appendChild(container);

        gelem("idmwcn").onclick = function(){
            //self.callfunct();
            self.hide();
        };
    
        gelem("idmwok").onclick = function(){
            self.callfunct();
            self.hide();
        };
    
        gelem("idmwcs").onclick = function(){
            if (self.funct!=null){
                self.callfunct();
            }
            self.hide();
        };
    };
}
