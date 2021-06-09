/*
# Author: Ivar Vargas Belizario
# Copyright (c) 2020
# E-mail: ivar@usp.br
*/

function User() {
    let self = this;

    this.userlist = [];

    this.listUsers = function () {
        var iduser = getCookie("email");
        //console.log("iduser", iduser);
        var ob = new ServiceData("load user");
        ob.in.argms["type"] = 18;
        ob.event = function () {
            self.userlist = this.ou;
            //console.log("self.userlistxx", self.userlist);
            self.searchtuser("");
        };
        ob.start();
    };

    this.searchtuser = function (txt) {
        var txt = trim(txt);
        gelem("iduserlist").innerHTML = "";
        let b = [];
        if (txt != "") {
            b = self.userlist.filter(item => item.name.toLowerCase().indexOf(txt) > -1);
        }
        else {
            b = self.userlist;
        }
        
        // console.log("self.userlist", self.userlist);
        // console.log("self.bbb", b);

        var txtx = `<table class="table table-striped table-sm btn-table" style="margin: 0 auto">`;
        txtx += "<thead>"
        txtx += "<tr>"
        txtx += "<th>Name</th>"
        txtx += "<th>User</th>"
        txtx += "<th>Is admin?</th>"
        txtx += "<th>Actions</th>"
        txtx += "</tr>"
        txtx += "</thead>"
        txtx += "<tbody>"
        for (var i in b){
            user = b[i];

            txtx += "<tr>"; 
            txtx += "<td>"+user["name"]+"</td>"; 
            txtx += "<td>"+user["email"]+"</td>"; 

            action = ``;
            if ("adminid" in user && user["adminid"] == 1){
                action = `
                <a href="#" class="btn btn-light btn-sm">
                    <i class="fas fa-user-cog fa-lg"
                    style="color: #1479d9;"></i>
                </a>
                `;    
            }

            txtx += "<td>"+action+"</td>"; 

            action = `
            <a href="#" class="btn btn-light btn-sm"
                title="Convert to administrator"
                onclick="
                    USERC.setAdmin(GFFOBJ.email, '`+ user["email"] + `',1);
                "
            >
                <i class="fas fa-user-cog fa-lg"
                    style="color: #1479d9;"
                ></i>
            </a>
            <a href="#" class="btn btn-light btn-sm"
                title="Convert to not administrator"
                onclick="
                    USERC.setAdmin(GFFOBJ.email, '`+ user["email"] + `',0);
                "
            >
                <i class="fas fa-user-cog fa-lg"
                    style="color: #666;"
                ></i>
            </a>
            `;
            txtx += "<td>"+action+"</td>"; 
            txtx += "</tr>"; 
        }
        txtx += "</tbody>"
        txtx += "</table>"; 
        gelem("iduserlist").innerHTML = txtx;
    };

    this.addUser = function () {
        var uname = trim(gvalue("idnewusname"));
        var uemail = trim(gvalue("idnewusemail"));
        var upass = trim(gvalue("idnewuspass"));
        if (uname==""){
            ffocus("idnewusname");
            return;
        }
        if (uemail==""){
            ffocus("idnewusemail");
            return;
        }
        if (upass==""){
            ffocus("idnewuspass");
            return;
        }

        if (uname!="" && uemail!="" && upass!=""){
            var ob = new ServiceData("new user");
            ob.in.argms["type"] = 19;
            ob.in.argms["data"] = {
                                        "name": uname,
                                        "fono":  "",
                                        "addres": "",
                                        "email": uemail,
                                        "password": upass
                                        };        
            ob.event = function () {
                var res = this.ou;
                //console.log("res", res);
                self.listUsers();
            };
            ob.start();
        }
    };

    this.setAdmin = function (email0, email1, idv) {
        var ob = new ServiceData("new user");
        ob.in.argms["type"] = 20;
        ob.in.argms["data"] =   {
                                    "email0": email0,
                                    "email1": email1,
                                    "adminid": idv
                                };        
        ob.event = function () {
            var res = this.ou;
            //console.log("res", res);
            self.listUsers();
        };
        ob.start();
    };


    this.newUserForm = function () {
        // gelem("idwinmodal").style.display = "block";
        // gelem("idwinmodaltitle").innerHTML = "Add new user";
        // gelem("idwinmodalbody").innerHTML = "...";

        var txtx =  `
        <table>
            <!--
            <tr>
                <td>Name</td>
                <td>E-mail</td>
                <td>Password</td>
                <td></td>
            </tr>
            -->
            <tr>
                <td>
                    <input id="idnewusname" type="text" class="form-control"
                        placeholder="Name user"
                    >
                </td>
                <td>
                    <input id="idnewusemail" type="text" class="form-control"
                        placeholder="E-mail"
                    >
                </td>
                <td>
                    <input id="idnewuspass" type="text" class="form-control"
                        placeholder="Password" value=""
                    >
                </td>
                <td>
                    <button class="btn btn-primary" type="button"
                        title="Add new user"
                        onclick="
                            USERC.addUser();
                        "
                    >
                        <i class="fa fa-user-plus fa-lg"></i>
                    </button>
                </td>
            </tr>
        </table>
    `;
        // gelem("idwinmodalbody").innerHTML = txtx;
        return txtx;
    };
}
USERC = new User();