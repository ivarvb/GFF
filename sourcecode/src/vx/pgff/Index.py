#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Author: Ivar Vargas Belizario
# Copyright (c) 2020
# E-mail: ivar@usp.br

import tornado.ioloop
import tornado.web
import tornado.httpserver

from vx.pgff.Settings import *
from vx.pgff.BaseHandler import *

class Index(BaseHandler):
    def get(self):
        if self.current_user == None and Settings.MULIUSER==1:
            self.redirect("./login")
            return
        else:
            #self.render("index.html",email=self.get_current_email(), pathroot=Settings.PATHROOT)
            self.render(
                "index.html",
                email=self.get_current_email(),
                adminid=self.get_current_adminid(),
                multiuser=Settings.MULIUSER
            )

