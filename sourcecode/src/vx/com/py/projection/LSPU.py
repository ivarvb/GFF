#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Author: Liz M. Huancapaza Hilasaca
# Copyright (c) 2020
# E-mail: lizhh@usp.br

# Adapted from:
# Least Square Projection: A Fast High-Precision Multidimensional Projection Technique and Its Application to Document Mapping
# https://doi.org/10.1109/TVCG.2007.70443

import queue as Q
import random
import numpy as np

import math

from time import process_time 


from sksparse.cholmod import cholesky_AAt
from sksparse.cholmod import cholesky


#from lsp.MData import *
from vx.com.py.proximity.ANNFE import *
from vx.com.py.matrix.Sparse import *
from vx.com.py.matrix.MData import *
from vx.com.py.graph.GNNFE import *
from vx.com.py.sampling.Sampling import *
#from lsp.Projection import *
from vx.com.py.projection.MDSP import *
from vx.com.py.projection.TSNEP import *
from vx.com.py.projection.UMAPP import *

#########################
# Class LPS:
#########################
class LSPU(Projection):
    def __init__(self, X=None, smp=None, smpsize=None, Xsmp2D=None, smptype="random", smpprj=None, proxtype=0, p=2):


# selectrows

        # self.XFE = XFE
        # self.X = X
        self.smp = smp
        self.Xsmp = []
        self.smpsize = smpsize
        self.Xsmp2D = Xsmp2D;
        self.smptype = smptype
        self.smpprj = smpprj
        self.proxtype = proxtype
        self.knnsize = 10;
        self.clusterscentroids = None;

        super().__init__(X,p)

    def execute(self):
        start = process_time()
        self.smpsize = int(self.X.rows()/10.0)

        #self.smp, self.clusterscentroids = Sampling.execute(self.X, self.smpsize, self.smptype, self.proxtype);
        self.smp, self.clusterscentroids = Sampling.executeFE(self.X, self.smpsize, self.smptype, self.proxtype);
        self.Xsmp = self.X.selectrows(self.smp)
        #self.Xsmp = MData.samplex(self.X, smp_r=self.smp)
        self.smpprj.setX(self.Xsmp.tolist());
        self.Xsmp2D = self.smpprj.execute();
            
        end = process_time()
        print ("time sampling and projection: {:.5f}".format(end-start))


        #n = self.X.rows()
      
        start = process_time()
        neighbors = ANNFE.execute(self.knnsize, self.X, self.proxtype, clusterscentroids=self.clusterscentroids);
        end = process_time()
        #print("neighbors", neighbors)
        print ("time ANNFE: {:.5f}".format(end-start))

        start = process_time()
        gnn = GNNFE().execute(neighbors, self.X, self.proxtype);
        end = process_time()
        print ("time GNNFE: {:.5f}".format(end-start))

        start = process_time()
        x2 = LSPU.projectionls(neighbors, self.smp, self.Xsmp2D)
        end = process_time()
        print ("time linear system: {:.5f}".format(end-start))

        #print("neighborsneighbors", neighbors)
        #exit();
        del self.clusterscentroids;
        del gnn;
        del neighbors
        del self.Xsmp2D

        return x2

    @staticmethod
    def projectionls(neighbors, smp, Xsmp2D):
        rows = len(neighbors) + len(smp);
        cols = len(neighbors);

        sA = SparseM2D()

        for i in range(len(neighbors)):
            sA.append(i, i, 1.0)
            maxv = -float('inf');
            minv =  float('inf');
            for nv in neighbors[i]:
                j = nv[0]
                w = nv[1]
                if maxv < w:
                    maxv = w
                if minv > w:
                    minv = w

            sumv = 0.0;
            for nv in neighbors[i]:
                w = nv[1]
                if maxv > minv:
                    d = (((w - minv) / (maxv - minv)) * (0.9)) + 0.1;
                    sumv += (1 / d);

            for nv in neighbors[i]:
                j = nv[0]
                w = nv[1]
                if maxv > minv:
                    d = (((w - minv) / (maxv - minv)) * (0.9)) + 0.1;
                    sA.append(i, j,  (-((1.0 / d) / sumv))  )
                else:
                    sA.append(i, j,  (-(1.0 / len(neighbors[i]) ))  )

        # add samples
        for i in range(len(smp)):
            sA.append(len(neighbors)+i, smp[i],  1.0  )

        sB = SparseM2D()
        for i in range(len(Xsmp2D)):
            sB.append(len(neighbors)+i, 0, Xsmp2D[i][0]);
            sB.append(len(neighbors)+i, 1, Xsmp2D[i][1]);

        A = sA.makeScipySparse(rows, cols)
        B = sB.makeScipySparse(rows, 2)

        # ATA = (A.T*A)
        # ATB = (A.T*B)
        # factor = cholesky(ATA, beta=1.0)
        # x2 = factor(ATB).toarray()
        

        factor = cholesky_AAt(A.T)
        x2 = factor(A.T * B).toarray()

        # print(ATA)
        # print(ATB)
        #print(x2)
        del sA
        del sB
        del A
        del B

        return x2
