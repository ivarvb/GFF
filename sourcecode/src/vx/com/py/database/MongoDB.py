#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Author: Ivar Vargas Belizario
# Copyright (c) 2020
# E-mail: ivar@usp.br


from pymongo import MongoClient
import urllib.parse

class MongoDB:
    DBACCESS = 0
    @staticmethod
    def connect(arg):
        u = urllib.parse.quote_plus(arg["username"])
        p = urllib.parse.quote_plus(arg["password"])

        #"mongodb://username:password@host1:port1/database?authSource=source_database"
        
        url = None
        # mongodb without user and password
        if MongoDB.DBACCESS==0:
            #url = 'mongodb://%s:%s@%s:%s/%s?authSource=%s&authMechanism=%s' % (u,p,arg["host"],arg["port"],arg["database"],arg["audb"],"SCRAM-SHA-1")
            url = 'mongodb://%s:%s/%s' % (arg["host"],arg["port"],arg["database"])
        # mongodb with user and password
        elif MongoDB.DBACCESS==1:
            url = 'mongodb://%s:%s@%s:%s/%s?authSource=%s&authMechanism=%s' % (u,p,arg["host"],arg["port"],arg["database"],arg["audb"],"SCRAM-SHA-1")

        #url = 'mongodb://%s:%s@%s:%s/%s?authSource=%s' % (u,p,arg["host"],arg["port"],arg["database"],arg["audb"])
        #print ("url",url)
        con = MongoClient(url)
        return con
    
    @staticmethod
    def find(arg, namecollection, query):
        con = MongoDB.connect(arg)
        db = con[arg["database"]]
        coll = db[namecollection]
        data = coll.find(query);
        data = list(data)
        con.close()
        return data

    @staticmethod
    def aggregate(arg, namecollection, query):
        con = MongoDB.connect(arg)
        db = con[arg["database"]]
        coll = db[namecollection]
        data = coll.aggregate(query);
        con.close()
        return data

    @staticmethod
    def insert(arg, namecollection, query):
        con = MongoDB.connect(arg)
        db = con[arg["database"]]
        coll = db[namecollection]
        data = coll.insert_one(query).inserted_id
        con.close()
        # return id of insert
        return data

    # query = { "_id": "455456464" }
    @staticmethod    
    def delete(arg, namecollection, query):
        con = MongoDB.connect(arg)
        db = con[arg["database"]]
        coll = db[namecollection]
        data = coll.delete_one(query)
        con.close()        
        return data

    # queryid = { "_id": "455456464" }
    # queryupdate = { "somecolumn": "new value to upadte" }
    @staticmethod
    def update(arg, namecollection, queryid, queryupdate):
        con = MongoDB.connect(arg)
        db = con[arg["database"]]
        coll = db[namecollection]
        data = coll.update_many( queryid, {"$set":queryupdate} )
        con.close()
        return data


   
