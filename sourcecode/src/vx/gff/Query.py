#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Author: Ivar Vargas Belizario
# Copyright (c) 2020
# E-mail: ivar@usp.br

import sys
sys.setrecursionlimit(100000)


import tornado
import tornado.ioloop
import tornado.web
import tornado.httpserver

import threading


import ujson
import glob
import os

import pandas as pd
import numpy as np
import os.path
import math

import bcrypt
import uuid

import zipfile
import io
from io import BytesIO
from datetime import datetime
from bson.objectid import ObjectId


from vx.gff.Settings import *
from vx.gff.BaseHandler import *
from vx.gff.MakeProjection import *
from vx.gff.graphtree.gff import *
from vx.gff.User import *


from vx.com.py.matrix.MData import *
from vx.com.py.database.MongoDB import *


class Query(BaseHandler):

    #Get RequestHandler
    def get(self):
        #MongoDB.dbaccess = Settings.DBACCESS


        obj = ""
        
        #try:
        if True:    
            app = DataTransfer(self.get_argument('data'))

            if app.argms["type"]==0:
                #print("app.argms", app.argms)
                if app.argms["algorithm"]=="mst" or app.argms["algorithm"]=="nj":
                    # 0:ok; 1:working; 2:error
                    # lock dataset
                    status = Query.getStatus(app)
                    if status["statusopt"]==0:
                        Query.setStatus(app, 1);
                        t = threading.Thread(target=Query.processFeatures, args=(app,))
                        t.start()

                    obj = ujson.dumps(status);

            elif app.argms["type"]==1:
                # 0:ok; 1:working; 2:error
                # lock dataset
                status = Query.getStatus(app)
                if status["statusopt"]==0:
                    Query.setStatus(app, 1);
                    t = threading.Thread(target=Query.processInstances, args=(app,))
                    t.start()
                
                obj = ujson.dumps(status);

            elif app.argms["type"]==2:
                obj = ujson.dumps(Query.listdatasets(self.current_user));

                """
                elif app.argms["type"]==2:
                    obj = ujson.dumps(Query.loadatributenames(app));
                """

            elif app.argms["type"]==4:
                obj = ujson.dumps(Query.getdatasetname(app));

            elif app.argms["type"]==5:
                obj = ujson.dumps(Query.opencsv(app));

            elif app.argms["type"]==6:
                obj = ujson.dumps(Query.updatedatasetname(app));
            elif app.argms["type"]==7:
                obj = ujson.dumps(Query.clonedataset(app, self.current_user));
            elif app.argms["type"]==8:
                obj = ujson.dumps(Query.sharedataset(app));
            elif app.argms["type"]==9:
                obj = ujson.dumps(Query.unsharedataset(app));
            elif app.argms["type"]==10:
                obj = ujson.dumps(Query.dropdataset(app.argms["file"]));

            elif app.argms["type"]==11:
                obj = ujson.dumps(User.changePassword(app, self.current_user));

            elif app.argms["type"]==12:
                obj = Query.downloaddataset(app, self.current_user, self);

            elif app.argms["type"]==13:
                obj = ujson.dumps(Query.silhouette(app));

                #elif app.argms["type"]==14:
                #    obj = Query.openfeature(app)
                #    obj = ujson.dumps(obj);
                #    
                #elif app.argms["type"]==15:
                #    obj = Query.openinstance(app)
                #    obj = ujson.dumps(obj);

            #elif app.argms["type"]==16:
            #    obj = Query.export2dproj(app, self);

            elif app.argms["type"]==17:
                obj = Query.exportfeat2datafile(app, self);

            elif app.argms["type"]==18:
                obj = User.getUsers();
                obj = ujson.dumps(obj);

            elif app.argms["type"]==19:
                obj = User.newUser(app.argms["data"]);
                obj = ujson.dumps(obj);

            elif app.argms["type"]==20:
                obj = User.setAdmin(app.argms["data"]);
                obj = ujson.dumps(obj);

            elif app.argms["type"]==21:
                obj = ujson.dumps(Query.makeInstancesLabels(app));

            elif app.argms["type"]==22: 
                obj = ujson.dumps(Query.getUnselecteFeatures(app)); 

            elif app.argms["type"]==23: 
                status = Query.getStatus(app)
                #if status["statusopt"]==0: """
                status = Query.setListFeaturesChecks(app); 
                
                obj = ujson.dumps(status);
                
            elif app.argms["type"]==24: 
                obj = ujson.dumps(Query.opendataset(app)); 

        #except Exception as e:
        #    print("Error: " + str(e))

        
        # self.write(ujson.dumps(obj))
        self.write(obj)
        self.finish()
        #self.write(obj)


    #Post RequestHandler
    def post(self):
        rs = ""
        if self.current_user:
            app = DataTransfer(self.get_argument('data'))
            
            if app.argms["type"]==3:
                app.argms["file"] = self.request.files['fileu'][0]
    #            obj.file = filed['body'].decode('utf-8')

            rs = Query.uploadfiledata(app.argms, self.current_user);

        self.write(rs)


    @staticmethod
    def converid(idin):
        """ 
        #idin = file
        if Settings.MULIUSER == 1:
            #idin = idin.decode("utf-8");
            idin = ObjectId(idin) """
        idin = ObjectId(idin)
        return idin

    @staticmethod
    def processFeatures(app):
        try:
            #Query.setStatus(app, 0)
            ufe = Query.getUnselecteFeatures(app)
            g = Graph()
            g.make_graph(Settings.DATA_PATH, ufe, app.argms)

            app.argms["nodes"] = g.data["graph"]["nodes"];
            app.argms["ranking"] = g.data["ranking"];
            app.argms["rankingmin"] = g.data["rankingmin"];
            app.argms["rankingmax"] = g.data["rankingmax"];

            Query.savegraph(app,g.data);
         
        except Exception as e:
            # error dataset
            print("error in save graph", e)
            Query.setStatus(app, 2);
        finally:
            # unlock dataset
            Query.setStatus(app, 0);
        
        #Query.setStatus(app, 0)


    @staticmethod
    def processInstances(app):
        try:
            dap = MakeProjection()
            dap.execute(app.argms);
            Query.saveprojection(app,dap.data);
        except Exception as e:
            # error dataset
            print("error save projection", e)
            Query.setStatus(app, 2);
        finally:
            # unlock dataset
            Query.setStatus(app, 0);




    @staticmethod
    def makedir(ndir):
        if not os.path.exists(ndir):
            os.makedirs(ndir, mode=0o777)

    # static query methods
    @staticmethod
    def listfiles(outdir, ext):
        dires = []
        fileso = []
        for name in os.listdir(outdir):
            dires.append(os.path.join(outdir, name))
            if name.endswith(ext):
#                fileso.append(str(os.path.join(outdir, str(name))))
                fileso.append({"name":str(name)})
        return fileso

    @staticmethod
    def listdirs(folder):
        if os.path.exists(folder):
            # listd =  [d for d in os.listdir(folder) if os.path.isdir(os.path.join(folder, d))]
            # for d in listd:
            #     if os.path.isdir(os.path.join(folder, d)):
            return [d for d in os.listdir(folder) if os.path.isdir(os.path.join(folder, d))]
        else:
            return []

    @staticmethod
    def listdatasets(iduser):
        rs = []
        """         
        if Settings.MULIUSER == 0:
            dir_list = Query.listdirs(Settings.DATA_PATH)
            for di in dir_list:
                ro = DBX.find(DBS.DBGFF, "data",{"_id": di})
                if len(ro)>0:
                    for row in ro:
                        #if len(row)>0 and "_id" in row:
                        if len(row)>0:
                            rs.append( {"_id":row["_id"], 
                                "_id_user": "localuser",
                                "owner":"localuser",
                                "name":row["name"],
                                "dateupdate":row["dateupdate"],
                                "isshare":row["isshare"],
                                } ) 

        elif Settings.MULIUSER == 1:"""

        iduser = iduser.decode("utf-8")
        dbs =   list(MongoDB.aggregate(DBS.DBGFF, "data",
                        [
                            {"$lookup":
                                {
                                    "from": "user",
                                    "localField": "_id_user",
                                    "foreignField" : "_id",
                                    "as": "usersUnits",
                                }
                            },
                            {"$match": {
                                        "$or":  [
                                                    {"_id_user": ObjectId(iduser)},
                                                    {"isshare": 1}
                                                ]
                                        }
                            },
                            {"$project":
                                {   
                                    "_id" : 1,
                                    "_id_user": 1 ,
                                    "name": 1,
                                    "dateupdate" : 1,
                                    "isshare" : 1,
                                    "usersUnits._id" : 1 ,
                                    "usersUnits.name" : 1 ,
                                } 
                            },
                            {
                                "$sort": {
                                    "dateupdate": -1
                                }
                            }
                        ]
                    ))

        #print("rowvrowrow", dbs)
        for row in dbs:
            rs.append( {"_id":str(row["_id"]), 
                            "_id_user_query": str(iduser),
                            "_id_user": str(row["_id_user"]),
                            "owner":row["usersUnits"][0]["name"],
                            "name":row["name"],
                            "dateupdate":row["dateupdate"],
                            "isshare":row["isshare"],
                            } )
        return rs

    @staticmethod
    def loadatributenames(app):
        idin = Query.converid(app.argms["file"])

        columns = []
        da = list(DBX.find(DBS.DBGFF, "data", {"_id": idin}))
        for d in da:
            if "fenames" in d and len(d["fenames"])>0:
                columns = d["fenames"] 
            else:
                #f = open(Settings.DATA_PATH+app.argms["file"]+"/transform.csv", mode="r", encoding='utf-8-sig')
                f = open(Settings.DATA_PATH+app.argms["file"]+"/transform.csv", mode="r", encoding='utf-8-sig')
                columns = f.readline().split(",")
                columns = [x.strip() for x in columns]
                f.close()

                columns_aux = []
                for col in columns:
                    #if col != "INDEXIDUID_":
                    columns_aux.append(col)
                columns = columns_aux


                DBX.update( DBS.DBGFF, "data",
                        {'_id': idin},
                        {'fenames':columns})
        return columns

    @staticmethod
    def uploadfiledata(argms, iduser):
        r = """<script>
                parent.mwalert('','Error: upload file');
                parent.opendatsetparser();
                </script>"""

        """
        if Settings.MULIUSER == 1:
            iduser = ObjectId(iduser.decode("utf-8")) """
        iduser = ObjectId(iduser.decode("utf-8"))
        #print("XXXXXXXXx1")
        path = Settings.DATA_PATH
        o_fname, ext = os.path.splitext(argms["file"]['filename'])        
        ext = ext.lower()

        dt_string = Query.now()
        #print("XXXXXXXXx2")
        if ext == ".csv" or ext == ".zip":
            rowdata =   {
                                "fenames": [],            
                                "name": o_fname, 
                                "type": ext,

                                "configfeature": {},
                                "typefeature": "",
                                "layoutfeature": "",
                                "versionfeature": Settings.VERSION,
                                "featurecheck": [],

                                "configinstance": {},
                                "typeinstance": "",
                                "layoutinstance": "",
                                "versioninstance": Settings.VERSION,

                                "datecreate": dt_string,
                                "dateupdate": dt_string,
                                "hasupdate": 0,
                                "isshare": 0,
                                
                                "statusopt": 0,
                                "statusval": "",
                                
                                "_id_user":iduser,
                                
                            };
                
            idin = None
            try:
            #if True:
            
                idin = DBX.insert(DBS.DBGFF, "data", rowdata)
                idin = str(idin)

                idin = Query.converid(idin)

                da = list(DBX.find(DBS.DBGFF, "data", {"_id": idin}))
                #print("XXXX",da)
                for d in da:
                    if ext == ".csv":
                        # save file
                        Query.savefile(path, str(idin), argms["file"]['body'])

                    elif ext == ".zip":
                        z = zipfile.ZipFile(io.BytesIO(argms["file"]['body']))
                        data = z.read(z.infolist()[0])
                        Query.savefile(path, str(idin), data)
                    r = "<script>parent.opendatsetparser();</script>"
            except Exception as e:
                print("error upload file",e)
            #    if idin!=None:
                Query.dropdataset(str(idin))


            """
                elif ext == ".data":
                # save file
                n_fname = idin;
                n_fname_dir = path+n_fname;

                filename_o = n_fname_dir+"/original.data";
                filename_t = n_fname_dir+"/transform.csv";

                #create directory
                if not os.path.exists(n_fname_dir):
                    os.makedirs(n_fname_dir)
                    
                #create original csv file
                output_file = open(filename_o, 'wb')
                output_file.write(argms["file"]['body'])
                output_file.close()
                argms["file"] = "";
                    
                #read data original.csv and save
                MData.converdata2csv(filename_o, filename_t)
            """
        #print("XXXXXXXXx3")
        return r

    @staticmethod
    def savefile(path, n_fname, data):
        #n_fname = idin;
        n_fname_dir = path+n_fname;

        filename_o = n_fname_dir+"/original.csv";
        filename_t = n_fname_dir+"/transform.csv";

        #create directory
        Query.makedir(n_fname_dir)

        #create original csv file

        #'wb'
        output_file = open(filename_o, mode="wb")
        output_file.write(data)
        output_file.close()
        #argms["file"] = "";
                    
        #save transform csv file
        df = pd.read_csv(filename_o, delimiter=",")
        cat_columns = df.select_dtypes(['object']).columns
        df[cat_columns] = df[cat_columns].astype('category')
        for col in cat_columns:
            df[col] = df[col].cat.codes
        df.to_csv(filename_t, index=False)
        
        del df
        
    @staticmethod
    def getdatasetname(app):
        idin = Query.converid(app.argms["file"])

        re = ""
        da = list(DBX.find(DBS.DBGFF, "data", {"_id": idin}))
        for d in da:
            re = d["name"];

        return re

    @staticmethod
    def setListFeaturesChecks(app):
        idin = Query.converid(app.argms["file"])
        feidlist = app.argms["data"]
           
        da = list(DBX.find(DBS.DBGFF, "data", {"_id": idin}))
        for d in da:
            featurecheck = []
            if "featurecheck" in d and len(d["featurecheck"])>0:
                featurecheck = d["featurecheck"]
            else:
                cols = Query.loadatributenames(app)
                if len(cols)>0:
                    featurecheck = [1 for i in range(len(cols))]

            for i, v in feidlist:
                featurecheck[i] = v
            
            DBX.update( DBS.DBGFF,"data",
                        {'_id': idin},
                        {'featurecheck':featurecheck})

        rs = {"statusopt":0, "statusval":"", "response":{}}
        return rs

    @staticmethod
    def getUnselecteFeatures(app):
        result = []
        idin = Query.converid(app.argms["file"])

        da = list(DBX.find(DBS.DBGFF, "data", {"_id": idin}))
        for d in da:
            if "featurecheck" in d and len(d["featurecheck"])>0:
                featurecheck = d["featurecheck"]
                for i in range(len(featurecheck)):
                    if featurecheck[i] == 0:
                        result.append(i);
            else:
                cols = Query.loadatributenames(app)
                if len(cols)>0:
                    featurecheck = [1 for i in range(len(cols))]
                    DBX.update( DBS.DBGFF,"data",
                                {'_id': idin},
                                {'featurecheck':featurecheck})

        return result;

    @staticmethod
    def opencsv(app):
        filefe = Settings.DATA_PATH+app.argms["file"]+"/transform.csv"
        df = pd.read_csv(filefe)

        return {"response":1};

    @staticmethod
    def updatedatasetname(app):
        idin = Query.converid(app.argms["file"])

        nname = app.argms["newname"]
        DBX.update( DBS.DBGFF,"data", {'_id': idin}, {'name':nname})

        return {"response":1};

    @staticmethod
    def clonedataset(app, iduser):
        idin = Query.converid(app.argms["file"])
        """ 
        if Settings.MULIUSER == 1:
            iduser = iduser.decode("utf-8") """
        iduser = iduser.decode("utf-8")
        iduser = Query.converid(iduser)
        
        dat = list(DBX.find(DBS.DBGFF,"data", {"_id": idin}))
        datc = {}
        for row in dat:
            for k, v in row.items():
                if k != "_id":
                    datc[k] = v

        dt_string = Query.now();
        datc["name"] += " (clone)";
        datc["datecreate"] = dt_string;
        datc["dateupdate"] = dt_string;
        datc["_id_user"] = iduser;
        #datc["_id"] = DBFile.uid();

        idinsert = DBX.insert(DBS.DBGFF, "data", datc)
        idinsert = str(idinsert)

        ndir = Settings.DATA_PATH+idinsert
        Query.makedir(ndir)
        os.popen("rsync -arv --exclude 'data.obj' "+Settings.DATA_PATH+str(idin)+"/ "+ndir)

        return {"response":1};

    @staticmethod
    def downloaddataset(app, iduser, selft):
        idin = Query.converid(app.argms["file"])

        zipname="download.zip"

        zipb = ""
        dat = list(DBX.find( DBS.DBGFF,"data", {"_id": idin}))
        for row in dat:
            zipname=row["name"]+".zip";
            f  = BytesIO();
            
            dirpath = Settings.DATA_PATH+str(idin)

            fzip = zipfile.ZipFile(f, 'w', zipfile.ZIP_DEFLATED)
            basedir = os.path.dirname(dirpath) + '/' 
            for root, dirs, files in os.walk(dirpath):
                if os.path.basename(root)[0] == '.':
                    continue
                # dirname = root.replace(basedir, '')
                dirname = root.replace(basedir, '')
                dirname = dirname.replace(str(idin), '')
                # dirname = root
                for fi in files:
                    if fi[-1] == '~' or (fi[0] == '.' and fi != '.htaccess'):
                        continue
                    fzip.write(root + '/' + fi, dirname + '/' + fi)

            selft.set_header('Content-Type', 'application/zip')
            selft.set_header("Content-Disposition", "attachment; filename=%s" % zipname)
            fzip.close()
            zipb = f.getvalue()
            f.close()
        return zipb;

    @staticmethod
    def setStatus(app, k):
        if "file" in app.argms and app.argms["file"]!="" and "statusval" in app.argms and app.argms["statusval"]!="":
            idin = Query.converid(app.argms["file"])
            statusval = app.argms["statusval"]
            
            DBX.update(DBS.DBGFF, "data",
                                    {'_id': idin},
                                    {'statusopt': k, 'statusval': statusval})

    @staticmethod
    def getStatus(app):
        idin = Query.converid(app.argms["file"])
        status = {"statusopt":0, "statusval":"", "response":{}}

        re = list(DBX.find(DBS.DBGFF, "data", {"_id":idin}))
        for r in re:
            if not "statusopt" in r or  not "statusval" in r:
                DBX.update(DBS.DBGFF, "data",
                                        {'_id': idin},
                                        {'statusopt':0, 'statusval':''})
            else:
                status["statusopt"] = r["statusopt"];
                status["statusval"] = r["statusval"];

        return status

    @staticmethod
    def sharedataset(app):
        idin = app.argms["file"]
        MongoDB.update(   DBS.DBGFF, "data",
                                    {"_id": ObjectId(idin)},
                                    {"isshare":1 }
                                )

        return {"response":1};

    @staticmethod
    def unsharedataset(app):
        idin = app.argms["file"]
        MongoDB.update(   DBS.DBGFF, "data",
                                    {"_id": ObjectId(idin)},
                                    {"isshare":0 }
                                )

        return {"response":1};

    @staticmethod
    def dropdataset(idin):
        filefe = Settings.DATA_PATH+str(idin)
        os.system("rm -rf "+filefe)
        """ 
        if Settings.MULIUSER == 1:
            MongoDB.delete(DBS.DBGFF, "data", {"_id": ObjectId(idin)}) """
        MongoDB.delete(DBS.DBGFF, "data", {"_id": ObjectId(idin)})

        r = "<script>parent.opendatsetparser();</script>"
        return {"response":r};

    @staticmethod
    def savegraph(app,db):
        idin = Query.converid(app.argms["file"])

        dataup =    {
                            'versionfeature':Settings.VERSION,
                            'typefeature':'graph',
                            'configfeature':app.argms,
                            'layoutfeature':'feature.obj',
                            'dateupdate': Query.now(),
                        }

        DBX.update(DBS.DBGFF, "data", {'_id':idin}, dataup)

        DBFile.writeFile(Settings.DATA_PATH+str(idin)+"/feature.obj", db)

    @staticmethod
    def saveprojection(app,db):
        idin = Query.converid(app.argms["file"])

        re = list(DBX.find(DBS.DBGFF, "data", {"_id":idin}))
        for r in re:

            if "configfeature" in r:
                config = r["configfeature"]
                config["projection"] = app.argms["projection"]
                config["instanceproximity"] = app.argms["instanceproximity"]
                
                config["target"] = app.argms["target"]
                config["intarget"] = app.argms["intarget"]
                config["featureselected"] = app.argms["featureselected"]
                config["idinstanceslabels"] = app.argms["idinstanceslabels"];
                #config["ranking"] = app.argms["ranking"]

                dataup = {"configfeature":config};
                
                DBX.update(DBS.DBGFF, "data", {'_id':idin}, dataup)

                app.argms["ranking"] = r["configfeature"]["ranking"];
                app.argms["nodes"] = r["configfeature"]["nodes"];

            dataup = {
                        "versioninstance":Settings.VERSION,
                        "typeinstance":"projection",
                        "configinstance":app.argms,
                        "layoutinstance":"instance.obj",
                        "dateupdate": Query.now(),
                    }
            DBX.update(DBS.DBGFF, "data", {'_id':idin}, dataup)

        DBFile.writeFile(Settings.DATA_PATH+str(idin)+"/instance.obj", db)


    @staticmethod
    def silhouette(app):
        idin = Query.converid(app.argms["file"])        

        re = list(DBX.find(DBS.DBGFF, "data", {"_id":idin}))
        si = 0.0
        for r in re:
            if "typeinstance" in r and r["typeinstance"]=="projection":
                filen = Settings.DATA_PATH+str(idin)+"/instance.obj"
                if os.path.exists(filen):
                    data = {}
                    try:
                        infil = open(filen, mode="r", encoding='utf-8-sig')
                        data = ujson.load(infil)
                        infil.close()
                    except:
                        print("Something went wrong")
                        data = {}
                    # finally:
                    #     data = {}
                
                    if "points" in data:
                        config = {}
                        if "configinstance" in r:
                            config =r["configinstance"]

                        pp = data["points"]
                        X, y, z = [],[],{}
                        for p in pp:
                            X.append([p["x"], p["y"]])    
                            y.append(p["t"])
                            z[p["t"]]=1
                        
                        it = 0
                        for zkey, zval in z.items():
                            z[zkey] = it
                            it += 1

                        si = Metrics.compute_silhoute(X,y,z);
                        config["silhouette"] = si;
                        DBX.update(DBS.DBGFF, "data", {'_id':idin}, {'configinstance':config})

        return si;

    @staticmethod
    def makeInstancesLabels(app):
        idin = Query.converid(app.argms["file"])
        colid = int(app.argms["idinstanceslabels"])
        #print("WWWWWWWWWWWWWWWWWWWWWWW")
        #print("colid", colid)

        re = list(DBX.find(DBS.DBGFF, "data", {"_id":idin}))

        for r in re:
            config_i = {}
            if "configinstance" in r:
                config_i = r["configinstance"]
            config_i["idinstanceslabels"] = colid;

            config_f = {}
            if "configfeature" in r:
                config_f = r["configfeature"]
            config_f["idinstanceslabels"] = colid;

            dataup = {'configfeature':config_f, 'configinstance':config_i};
            DBX.update(DBS.DBGFF, "data", {'_id':idin}, dataup)

                    
        #f = open(Settings.DATA_PATH+str(idin)+"/original.csv", mode="r",  encoding='utf-8-sig')
        f = open(Settings.DATA_PATH+str(idin)+"/original.csv", mode="r",  encoding='utf-8-sig')
        _featuresnames_index = f.readline().split(",")

        _featuresnames_index = [x.strip() for x in _featuresnames_index]
        #print("_featuresnames_index", _featuresnames_index);
        colname = _featuresnames_index[colid] 
        f.close()           
        

        df = pd.read_csv(   Settings.DATA_PATH+str(idin)+"/original.csv",
                            delimiter=",",
                            usecols=[colname])
        #rest = {}
        #rest["instanceslabels"] = [ str(df[app.argms["colname"]][ind]) for ind in df.index]
        #rest["idinstanceslabels"] = [ str(row[0]) for row in df.itertuples(index=False) ]
        rest = [ str(row[0]) for row in df.itertuples(index=False) ]
        del df
        del re
        return rest;


    """ 
    @staticmethod
    def export2dproj(app,selft):
        idin = Query.converid(app.argms["file"])

        re = list(DBX.find(DBS.DBGFF, "data", {"_id":idin}))
        export = ""
        name = ""
        for r in re:
            name = r["name"]
            if "typeinstance" in r and r["typeinstance"]=="projection":
                filen = Settings.DATA_PATH+str(idin)+"/instance.obj"
                if os.path.exists(filen):
                    data = {}
                    try:
                        infil = open(filen, "r")
                        data = ujson.load(infil)
                        infil.close()
                    except:
                        print("Something went wrong")
                        data = {}
                    # finally:
                    #     data = {}
                
                    if "points" in data:
                        pp = data["points"]
                        export = "DY\n" 
                        export += str(len(pp))+"\n" 
                        export += "2\n"
                        export += "x;y\n"
                        for p in pp:
                            export += "{};{:.6f};{:.6f};{:.1f}\n".format(p["id"],p["x"], p["y"], p["t"])

        selft.set_header('Content-Type', 'text/plain')
        selft.set_header("Content-Disposition", "attachment; filename=%s" % name+".prj")

        return export;
    """


    @staticmethod
    def opendataset(app):
        idin = Query.converid(app.argms["file"])
        colle = app.argms["data"]["collect"]
        query = app.argms["data"]["query"]

        rf = []
        rs = {};
        status = Query.getStatus(app)
        if status["statusopt"]==0:
            re = list(DBX.find(DBS.DBGFF, "data", {"_id":idin}))
            #print()
            for r in re:
                #print("re", re)
                r["_id"] = str(r["_id"])
                """ making projection from features selected """
                r["_id_user"] = str(r["_id_user"])            
                rs = r

                rs["fenames"] = Query.loadatributenames(app)
                rs["lastversion"] = Settings.VERSION
                if colle=="features":                
                    # open features
                    filen = Settings.DATA_PATH+str(idin)+"/feature.obj" 
                    rs["layoutfeature"] = DBFile.openFile(filen)


                elif colle=="instances":
                    # open instances
                    filen = Settings.DATA_PATH+str(idin)+"/instance.obj"
                    rs["layoutinstance"] = DBFile.openFile(filen)

                #filter
                for qrow in query:
                    aux = rs
                    for k in qrow:
                        if k in aux:
                            aux = aux[k]
                        else:
                            aux = {}
                            break;
                    rf.append({"query":qrow, "response":aux})

        status["response"] = rf
        return status




    """ 
    @staticmethod
    def openfeature(app):
        idin = app.argms["file"]
        cols = Query.loadatributenames(app.argms)

        if Settings.MULIUSER == 1:
            idin = ObjectId(idin)

        re = list(DBX.find(DBS.DBGFF, "data", {"_id":idin}))
        rs = {};
        for r in re:
            r["_id"] = str(r["_id"])
            r["_id_user"] = str(r["_id_user"])
            rs = r

            rs["fenames"] = cols
            rs["lastversion"] = Settings.VERSION


            filen = Settings.DATA_PATH+str(idin)+"/feature.obj" 
            dfile = {}
            if os.path.exists(filen):
                try:
                    infil = open(filen, "r")
                    dfile = ujson.load(infil)
                    infil.close()
                except:
                    print("Something went wrong")
                    dfile = {}
            rs["layoutfeature"] = dfile

        return rs;

    @staticmethod
    def openinstance(app):
        idin = app.argms["file"]
        #cols = Query.loadatributenames(app.argms)
        if Settings.MULIUSER == 1:
            idin = ObjectId(idin)

        re = list(DBX.find(DBS.DBGFF, "data", {"_id":idin}))
        rs = {};
        for r in re:
            r["_id"] = str(r["_id"])
            r["_id_user"] = str(r["_id_user"])
            rs = r

            #rs["fenames"] = cols
            rs["lastversion"] = Settings.VERSION

            filen = Settings.DATA_PATH+str(idin)+"/instance.obj"
            dfile = {}
            if os.path.exists(filen):
                try:
                    infil = open(filen, "r")
                    dfile = ujson.load(infil)
                    infil.close()
                except:
                    print("Something went wrong")
                    dfile = {}

            rs["layoutinstance"] = dfile

        return rs;
     """
    
    @staticmethod
    def exportfeat2datafile(app, selft):
        idin = Query.converid(app.argms["file"])
        
        filename =  Settings.DATA_PATH+str(idin)+"/transform.csv"    
        re = list(DBX.find(DBS.DBGFF, "data", {"_id":idin}))
        export = ""
        name = ""
        for r in re:
            name = r["name"]
            
            fnames = Query.loadatributenames(app);
            fnamesindex ={ str(fnames[i]):i for i in range(len(fnames))}

            layoutfeature = DBFile.openFile(Settings.DATA_PATH+str(idin)+"/feature.obj")
            nodes = layoutfeature["graph"]["nodes"]

            X = DataMatrix(filename)
            columns = X.columns()
            colsindexes = X.columnsindexes()
            
            XT = X.transpose()
            del X

            export = "DY\n" 
            export += str(len(nodes))+"\n" 
            export += str(XT.cols())+"\n" 
            nfecol = ["fe"+str(i) for i in range(XT.cols()) ]
            export += ";".join(nfecol)+"\n" 
            for nod in nodes:
                #i = fnamesindex[nod["label"]]
                i = nod["label"]
                row = [str(columns[i])]
                for j in range(XT.cols()):
                    row.append(str(XT.getValue(i,j)))

                export += ";".join(row)
                export += ";"+str(0.0)+"\n"
                
            del XT
            del fnamesindex
            del layoutfeature
            del nodes
            #target_id = X.columnindex(target)

        selft.set_header('Content-Type', 'text/plain')
        selft.set_header("Content-Disposition", "attachment; filename=%s" % name+".data")

        return export;
    
    @staticmethod
    def now():
        return datetime.now().strftime('%Y-%m-%d %H:%M:%S')




class DataTransfer:
    def __init__(self, data):
        self.argms = {}
        self.load(ujson.loads(data))

    def load(self, data):
        for k in self.__dict__:
            if k in data:
                setattr( self, k, (data[k]) )


"""
Database X
"""

class DBX:
    @staticmethod
    def find(dbs, collect, rdata):
        """ 
        rest = []
        if Settings.MULIUSER == 0:
            rest = DBFile.find(dbs, collect, rdata)
        elif Settings.MULIUSER == 1:
            rest = MongoDB.find(dbs, collect, rdata) """
        rest = MongoDB.find(dbs, collect, rdata)
        return rest
    @staticmethod
    def insert(dbs, collect, rdata):
        """ 
        rest = []
        if Settings.MULIUSER == 0:
            rest = DBFile.insert(dbs, collect, rdata)
        elif Settings.MULIUSER == 1:
            rest = MongoDB.insert(dbs, collect, rdata) """
        rest = MongoDB.insert(dbs, collect, rdata)
        return rest
    
    @staticmethod
    def update(dbs, collect, queryid, rdata):
        """ 
        if Settings.MULIUSER == 0:
            DBFile.update(dbs, collect, queryid, rdata)
        elif Settings.MULIUSER == 1:
            MongoDB.update(dbs, collect, queryid, rdata) """
        MongoDB.update(dbs, collect, queryid, rdata)

    @staticmethod
    def delete(dbs, collect, queryid):
        """ 
        if Settings.MULIUSER == 0:
            DBFile.delete(dbs, collect, queryid)
        elif Settings.MULIUSER == 1:
            MongoDB.delete(dbs, collect, queryid) """
        MongoDB.delete(dbs, collect, queryid)

"""
Database from file
"""
class DBFile:    
    global_lock = threading.Lock()

    """ multithreadiung read file """
    @staticmethod
    def openFile(pathf):
        dfile = {}
        try:
            #with open(pathf, mode="r", encoding='utf-8-sig') as fp:
            with open(pathf, mode="r", encoding='utf-8-sig') as fp:
                dfile = ujson.load(fp)
            """ with DBFile.global_lock:
                with open(pathf, mode="r", encoding='utf-8-sig') as fp:
                    dfile = ujson.load(fp) """
                    
        except Exception as e:
            print("Error opening file", e, pathf)
            dfile = {}

        return dfile

    """ @staticmethod
    def openFile(pathf):
        t = threading.Thread(target=DBFile.openFile_t, args=[pathf,])
        t.start() """




    """ multithreadiung write file """
    @staticmethod
    def writeFile_t(pathf, rdata):
        try:
            #with open(pathf, mode="w", encoding='utf-8-sig') as fp:
            #    ujson.dump(rdata, fp)
            with DBFile.global_lock:
                #with open(pathf, mode="w", encoding='utf-8-sig') as fp:
                with open(pathf, mode="w", encoding='utf-8-sig') as fp:
                    ujson.dump(rdata, fp, ensure_ascii=False)

        except Exception as e:
            print("Error writing file", pathf)

    @staticmethod
    def writeFile(pathf, rdata):
        t = threading.Thread(target=DBFile.writeFile_t, args=[pathf, rdata,])
        t.start()



    @staticmethod
    def find(dbs, collect, rdata):
        rdata["_id"] = str(rdata["_id"])
        rest = []
        f = Settings.DATA_PATH+rdata["_id"]+"/"+collect+".obj"            
        if os.path.isfile(f):
            rest = [DBFile.openFile(f)]
        return rest

    @staticmethod
    def insert(dbs, collect, rdata):
        idud = DBFile.uid()
        rdata["_id"] = idud

        ndir = Settings.DATA_PATH+idud

        Query.makedir(ndir)

        DBFile.writeFile(ndir+"/"+collect+".obj", rdata)
        return idud
    
    @staticmethod
    def update(dbs, collect, queryid, rdata):
        queryid["_id"] = str(queryid["_id"])
        #db = DBFile.openFile(Settings.DATA_PATH+queryid["_id"]+"/"+collect+".obj")
        #for k, v in rdata.items():
        #    db[k] = v

        # read and copy
        dat = list(DBX.find(DBS.DBGFF,collect,{"_id": queryid["_id"]}))
        db = {}
        for row in dat:
            for k, v in row.items():
                db[k] = v
        
        #print()
        #print("DB update1", db)

        # update
        for k, v in rdata.items():
            db[k] = v

        #print("DB update2", db)

        # write
        DBFile.writeFile(Settings.DATA_PATH+queryid["_id"]+"/"+collect+".obj", db)

    @staticmethod
    def uid():
        return uuid.uuid4().hex

