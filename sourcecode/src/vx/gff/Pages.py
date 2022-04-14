#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Author: Ivar Vargas Belizario
# Copyright (c) 2020
# E-mail: ivar@usp.br

import tornado.ioloop
import tornado.web
import tornado.httpserver
import ujson
import bcrypt

from vx.gff.Settings import *
from vx.gff.BaseHandler import *
from vx.gff.User import *



from vx.com.py.database.MongoDB import *

class Login(BaseHandler):
    def get(self):
        if Settings.MULIUSER==1:
            self.render("login.html")
        else:
            self.redirect("./")
        return

    def post(self):
        #User.hola()
        op = int(self.get_argument('option'))

        user = self.get_argument('user')
        pasw = self.get_argument('password')
        #print("user, pasw, op", user, pasw, op)
        re = User.login(user, pasw);
        if len(re)==1:
            for r in re:
                uid = str(r['_id'])
                #uid = ""+uid+"".decode("utf-8")
                self.set_secure_cookie("user", uid)
                self.set_secure_cookie("email", r['email'])
                #print("r['adminid']",r['adminid']);
                self.set_secure_cookie("adminid", str(r['adminid']))

                #self.set_secure_cookie("user", uid, expires_days=1)
                #self.set_secure_cookie("email", r['email'], expires_days=1)
            self.redirect("./")
            return
        else:
            self.redirect("./login")
            return

        return


class Logout(BaseHandler):
    def get(self):
        self.clear_cookie('user')
        self.clear_cookie('email')
        self.redirect("./")



class Index(BaseHandler):

    def initialize(self):
    #@staticmethod
    #def locallogin():
        pass
    """
        print("intildfaosf")
        if Settings.MULIUSER==1:
                self.set_secure_cookie("user", uid)
                self.set_secure_cookie("email", r['email'])
                #print("r['adminid']",r['adminid']);
                self.set_secure_cookie("adminid", str(r['adminid']))

                #self.set_secure_cookie("user", uid, expires_days=1)
                #self.set_secure_cookie("email", r['email'], expires_days=1)
            self.redirect("./")
    """            

    """
        us = "localuser"
        ps = None
        response = []

        re = list(MongoDB.find(DBS.DBGFF, "user", {"email":us}))
        
        if len(re)==1:
            for r in re:
                hd = r["password"].encode("utf-8")
                #print("ps, r['password']",ps, hd)
                if bcrypt.checkpw(ps, hd):

                    # re['adminid'] = 0

                    response = re
                    if not "adminid" in response[0]:
                        #print("responsexxx", response)
                        response[0]["adminid"] = "0";
                    
        return response
    """

    def get(self):
        # verifify self.current_user

        # automatic logins
        ####if Settings.MULIUSER==0:

        if self.current_user != None and not User.isuser(self.current_user):
            self.current_user = None

        if self.current_user == None and Settings.MULIUSER==1:
            self.redirect("./login")
            return
        else:
            #print("self.get_current_user", self.get_current_user())
            #self.render("index.html",email=self.get_current_email(), pathroot=Settings.PATHROOT)
            self.render(
                "index.html",
                email=self.get_current_email(),
                adminid=self.get_current_adminid(),
                multiuser=Settings.MULIUSER
            )



