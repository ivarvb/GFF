#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Author: Ivar Vargas Belizario
# Copyright (c) 2020
# E-mail: ivar@usp.br

import os
class DBS:
    # Change here the local configuration of the MongoDB
    DBGFF = {"host":"127.0.0.1", "port":"27017", "username":"admin", "password":"azul", "database":"graphvis","audb":"admin"};

class Settings:
    VERSION = 37.0
    ROOTID = 0
    DEBUG = True
    MULIUSER = 0
    DIRNAME = os.path.dirname(__file__)
    STATIC_PATH = os.path.join(DIRNAME, './static')
    TEMPLATE_PATH = os.path.join(DIRNAME, './templates')
    DATA_PATH = os.path.join(DIRNAME, '../../../../data/pgff/')

    COOKIE_SECRET = 'L8LwECiNRxdq2N0N2eGxx9MZlrpmuMEimlydNX/vt1LM='

    HOST = 'localhost'
    PORT = 8000

    PATHROOT = "http://localhost:"+str(PORT)+"/"
