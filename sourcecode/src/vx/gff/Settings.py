#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Author: Ivar Vargas Belizario
# Copyright (c) 2020
# E-mail: ivar@usp.br

import os

class Settings:
    VERSION = 37.0
    DBACCESS = 0 # for MongoDB configuration without user and password
    #DBACCESS = 1 # for MongoDB configuration with user and password
    ROOTID = 0
    DEBUG = True
    MULIUSER = 1
    DIRNAME = os.path.dirname(__file__)
    STATIC_PATH = os.path.join(DIRNAME, './static')
    TEMPLATE_PATH = os.path.join(DIRNAME, './templates')
    DATA_PATH = os.path.join(DIRNAME, '../../../../data/gff/')

    COOKIE_SECRET = 'L8LwECiNRxdq2N0N2eGxx9MZlrpmuMEimlydNX/vt1LM='

    HOST = 'localhost'
    PORT = 8000

    PATHROOT = "http://localhost:"+str(PORT)+"/"


class DBS:
    # Change USER_HERE, PASSWORD_HERE or DB_HERE
    DBGFF = {
        "host":"127.0.0.1",
        "port":"27017",
        "username":"",#USER_HERE
        "password":"",#PASSWORD_HERE
        "database":"gff",#DB_HERE
        "audb":"admin"
    };
    