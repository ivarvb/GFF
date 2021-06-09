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

from vx.pgff.Settings import *
from vx.pgff.BaseHandler import *
from vx.pgff.User import *



from vx.com.py.database.MongoDB import *

class Login(BaseHandler):
    def get(self):
        if Settings.MULIUSER==1:
            self.render("login.html")
        else:
            self.redirect("./")
        return

    def post(self):
        op = int(self.get_argument('option'))

        re = User.login(    self.get_argument('user'),
                            self.get_argument('password') );
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



