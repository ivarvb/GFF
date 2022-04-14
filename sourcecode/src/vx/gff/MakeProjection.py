#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Author: Ivar Vargas Belizario
# Copyright (c) 2020
# E-mail: ivar@usp.br

import matplotlib.pyplot as plt
import matplotlib


from vx.gff.Settings import *

from vx.com.px.dataset.dataio import DataMatrix, ProximityMatrix

# from vix.py.matrix.MData import *
from vx.com.py.matrix.CSVData import *
from vx.com.py.projection.MDSP import *
from vx.com.py.projection.TSNEP import *
from vx.com.py.projection.TSNEM import *
#from vix.py.projection.TSNEO import *


#!!!!!!!!!!!!!!!!!!!!!!!
from vx.com.py.projection.UMAPP import *
from vx.com.py.projection.PCAP import *
from vx.com.py.projection.ISOMAPP import *
from vx.com.py.projection.FASTMAPP import *
from vx.com.py.projection.LSP import *
from vx.com.py.projection.LSPU import *





class MakeProjection():
    def __init__(self):
        self.data = {"points":[],"tartegscolors":[],"tartegsnames":{}}

    def execute(self, argms):
        mt = argms["projection"]
        projprox = argms["instanceproximity"]

        featureselected= argms["featureselected"]
        filefepath = Settings.DATA_PATH+argms["file"]+"/"
        filefe = filefepath+"transform.csv"
        isfeature = True if int(argms["isfeature"])==1 else False
        targeti = argms["target"]

        # df = pd.read_csv(filefe)
        # dmat = MData.openfilecsv(filefe)
        
        # get only name without target
        # fenames = []
        # for c in dmat.columns_index():
        #     if c != target:
        #         fenames.append(c)
        # X = []
        # if len(featureselected)>0:
        #     sel = []
        #     for s,v in featureselected.items():
        #         sel.append(s)
        #     #print("dmat.cat_columns_i",dmat.columns,dmat.columns_i)
        #     #print("dmat.getData()",dmat.getData())
        #     #print("selselselselselselselselselselselselselsel", sel)
        #     X = dmat.sample(smp_cols=sel).getData()
        # else:
        #     X = dmat.sample(smp_cols=fenames).getData()

        start = process_time()
        XDF = DataMatrix(filefe)
        #target_index = XDF.columnindex(target)

        colsindexes = XDF.columnsindexes()
        colsnameslist = XDF.columns_index()
        trueids = XDF.trueids()
        
        targeti_true = trueids[targeti]
        target = colsnameslist[targeti_true]

        target_index = targeti
        fenames = []
        for name, i in colsindexes.items():
            if i != target_index:
                fenames.append(i)

        XR = None
        if len(featureselected)>0:
            XR = XDF.selectcolumns_index(featureselected)
        else:
            XR = XDF.selectcolumns_index(fenames)
        yt, ymint, ymaxt = XDF.getcolumn_index(targeti)
        X = XR.tolist()
        #print("yt",yt)
        end = process_time()
        print ("time read datamatrix fe time: {:.5f}".format(end-start))

        #y = dmat.sample(smp_cols=[target]).getData()

        N = len(X)

        X2 = []

        dissx = "euclidean"
        if projprox=="DCosine":
            dissx = "cosine"

        if mt == "tsne":
            #X2 = TSNEP(X).execute();
            X2 = TSNEM(X, proxtype=dissx).execute();
        elif mt == "umap":
            X2 = UMAPP(X, proxtype=dissx).execute();
            #X2 = None
        # elif mt == "mds":
        #     X2 = MDSP(X).execute();
        # elif mt == "pca":
        #     X2 = PCAP(X).execute();
        # elif mt == "isomap":
        #     X2 = ISOMAPP(X).execute();
        # elif mt == "fastmap":
        #     X2 = FASTMAPP(X).execute();
        # elif mt == "lspmds":
        #     X2 = LSP(X, smpprj=MDSP(), smptype="clusteringmedoids").execute()
        elif mt == "lsptsne":
            #X2 = LSP(X, smpprj=TSNEP(), smptype="clusteringmedoids").execute()

            #X2 = LSP(X, smpprj=TSNEM(), smptype="clusteringmedoids").execute()

            X2 = LSPU(  X=XR,
                        smpprj=TSNEM(proxtype=dissx),
                        proxtype=ProximityMatrix.POT[projprox],
                        smptype="clusteringmedoids"
                    ).execute()
            
        # elif mt == "lspisomap":
        #     X2 = LSP(X, smpprj=ISOMAPP(), smptype="clusteringmedoids").execute()
        # elif mt == "lspfastmap":
        #     X2 = LSP(X, smpprj=FASTMAPP(), smptype="clusteringmedoids").execute()
        # elif mt == "lspumap":
        #     X2 = LSP(X, smpprj=UMAPP(), smptype="clusteringmedoids").execute()


        havzero = False
        havzeroless = 1
        for i in range(N):
            yt[i] = int(yt[i])
            if yt[i]==0:
                havzero = True
                havzeroless = 0
                #break

        for i in range(N):
            yt[i] = yt[i]-havzeroless

        targetsnames = {yi:yi for yi in yt}
        ofile = filefepath+"original.csv"
        if os.path.isfile(ofile):
            OD = CSVData(ofile)
            target_y = OD.getcolumn(target)
            for i in range(len(yt)):
                targetsnames[yt[i]] = target_y[i]
            del OD

        self.data["tartegsnames"] = targetsnames
        # cma = plt.cm.get_cmap('rainbow')
#        colors = cma(np.linspace(0, 1))
#        colors = colors.tolist()
        
        # print("ytytytytytytytytytyt",len(yt))
        # print("target_nmesy",len(target_y))


        for i in range(N):
            self.data["points"].append({"id": i,"x": float(X2[i][0]),"y": float(X2[i][1]),"t": (yt[i]) })

        del XDF
        del XR
        del X

