#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Author: Ivar Vargas Belizario
# Copyright (c) 2020
# E-mail: ivar@usp.br

import tornado.ioloop
import tornado.web
import tornado.httpserver
import ujson
import datetime
from multiprocessing import cpu_count



#from ipy.dataio import *
#from ipy.db import *

from vx.pgff.Settings import *
from vx.pgff.BaseHandler import *
from vx.pgff.Index import *
from vx.pgff.Access import *
from vx.pgff.Query import *

class Server(tornado.web.Application):
    def __init__(self):
        handlers = [
            (r"/", Index),
            (r"/login", Login),
            (r"/logout", Logout),
            (r"/query", Query),

            (r"/lib/(.*)",tornado.web.StaticFileHandler, {"path": Settings.STATIC_PATH+"/lib"},),
            (r"/img/(.*)",tornado.web.StaticFileHandler, {"path": Settings.STATIC_PATH+"/img"},),
            (r"/data/(.*)",tornado.web.StaticFileHandler, {"path": Settings.DATA_PATH},),
            # (r"/data/(.*)",tornado.web.StaticFileHandler, {"path": "./static/data"},),
            # (r"/img/(.*)",tornado.web.StaticFileHandler, {"path": "./static/img"},)
        ]
        settings = {
            "template_path":Settings.TEMPLATE_PATH,
            "static_path":Settings.STATIC_PATH,
#            "debug":Settings.DEBUG,
            "cookie_secret": Settings.COOKIE_SECRET,
        }
        tornado.web.Application.__init__(self, handlers, **settings)

    @staticmethod
    def execute():
        if Settings.MULIUSER==1:
            User.rootinit();
            User.rootread();

        print ('The server is ready: http://'+Settings.HOST+':'+str(Settings.PORT)+'/')
        server = tornado.httpserver.HTTPServer(Server())
        server.bind(Settings.PORT)
        server.start(cpu_count())
    #    tornado.ioloop.IOLoop.current().start()
        tornado.ioloop.IOLoop.instance().start()



        
#if __name__ == "__main__":
#    print ('The server is ready: http://'+Settings.HOST+':'+str(Settings.PORT)+'/')
#    server = tornado.httpserver.HTTPServer(Server())
#    server.bind(Settings.PORT)
#    server.start(cpu_count())
##    tornado.ioloop.IOLoop.current().start()
#    tornado.ioloop.IOLoop.instance().start()










