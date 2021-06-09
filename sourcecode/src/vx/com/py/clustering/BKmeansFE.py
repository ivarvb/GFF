#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Author: Liz M. Huancapaza Hilasaca
# Copyright (c) 2020
# E-mail: lizhh@usp.br


import math
import random

import queue as Q
import inspect

from time import process_time 


#from vix.py.proximity.Proximity import *
from vx.com.px.dataset.dataio import DataMatrix
from vx.com.px.dataset.dataio import ProximityMatrix

class Cluster:
    def __init__ (self, cluster, centroid, medoid = None):
        self.cluster = cluster
        self.centroid = centroid
        self.medoid = medoid




class BKmeansFE:
    def __init__(self):
        pass

    @staticmethod
    def getCluster2Split(clusters):
        ci = 0
        for i in range(len(clusters)):
            if len(clusters[i].cluster)>len(clusters[ci].cluster):
                ci = i
        return ci;
    
    @staticmethod
    def getPivots(X, clust, centroids, proxtype):
        pivots = [-1, -1];

        cluster = clust.cluster
        ceid = clust.centroid
        size = int(1 + (len(cluster) / 10));

        paux = []
        for i in range(size):
            el = int((len(cluster) / size) * i)
            j = cluster[el]
            

            d = centroids.proximity_row( ceid,  X, j,  proxtype );
            paux.append((d, j));
        paux.sort(key = lambda x: x[0])
        pivots[0] = paux[int(len(paux) * 0.75)][1]

        paux = []
        for i in range(size):
            el = int((len(cluster) / size) * i)
            j = cluster[el]
            d = X.proximity_row( pivots[0],   X, j, proxtype );
            paux.append((d, j));

        paux.sort(key = lambda x: x[0])
        pivots[1] = paux[int(len(paux) * 0.75)][1];

        return pivots;
    
    @staticmethod
    def computeMean(X, cluster, twocentroids, itwo):
        z = float(len(cluster))

        twocentroids.fillrow(itwo, 0.0);
        # me = [0.0 for i in range(X.cols())]
        for i in cluster:
            for c in range(X.cols()):
                d = twocentroids.getValue(itwo, c) + (X.getValue(i,c)/z)
                twocentroids.setValue(itwo, c, d)

                # me[c] += (X.getValue(i,c)/z)
                
        # for c in range(X.cols()):
        #     twocentroids.setValue(itwo, c, me[c])

        # for c in range(X.cols()):
        #    print (twocentroids.getValue(itwo, c));
        # print("X")
        

    @staticmethod
    def computeMedoid(X, cluster, centroids, j, proxtype):
        mind = float('inf') 
        imed = -1
        for i in cluster:
            #d = Proximity.compute(X[i], centroids, proxtype)
            d = X.proximity_row(i, centroids, j, proxtype)
            if d<mind:
                imed = i
                mind = d
        return imed


    @staticmethod
    def splitCluster(ci, X, clusters, centroids, ck1, ck2, 
                        proxtype, max_iter=100, verbose=False):

        cluo = clusters.pop(ci)
        cluster = cluo.cluster
        # ceid = cluo.centroid

        # getting the two pivots
        pivots = BKmeansFE.getPivots(X, cluo, centroids, proxtype)

        # cluster = Util.shuffle(cluster)

        # clus1, clus2 = [cluster[0]], [cluster[1]]
        clus1, clus2 = [pivots[0]], [pivots[1]]
        # cent1, cent2 = X[pivots[0]], X[pivots[1]]

        centroids.copyrow(ck1, X, pivots[0]);
        centroids.copyrow(ck2, X, pivots[1]);

        it = 0
        while True:
            BKmeansFE.computeMean(X, clus1, centroids, ck1)
            BKmeansFE.computeMean(X, clus2, centroids, ck2)

            clus1 = []
            clus2 = []

            for i in cluster:
                d1 = X.proximity_row(i, centroids, ck1, proxtype)
                d2 = X.proximity_row(i, centroids, ck2, proxtype)

                if d1 < d2:
                    clus1.append(i);
                elif d2 < d1:
                    clus2.append(i);
                else:
                    if len(clus1) > len(clus2):
                        clus2.append(i);
                    else:
                        clus1.append(i);

            if len(clus1) < 1:
                clus1.append(clus2[0]);
                clus2.pop(0);
            elif len(clus2) < 1:
                clus2.append(clus1[0]);
                clus1.pop(0);

            #print(it)
            it = it+1
            if not it < max_iter:
                break;
            
        BKmeansFE.computeMean(X, clus1, centroids, ck1)
        BKmeansFE.computeMean(X, clus2, centroids, ck2)
    
        clusters.append(Cluster(clus1, ck1))
        clusters.append(Cluster(clus2, ck2))
        #print("ck1, ck2",ck1, ck2, len(clusters))


    @staticmethod
    def execute(X=None, k=2, proxtype=0, max_iter=15, verbose=False):

        start = process_time()

        clusters = [ Cluster( [ i for i in range(X.rows())], 0 ) ]
        
        centroids = DataMatrix()
        centroids.create(k*2, X.cols())

        centroids.copyrow(0, X, 0)
        ik = 0
        while len(clusters) < k:
            ci = BKmeansFE.getCluster2Split(clusters)
            if len(clusters[ci].cluster)>1:
                ik+=1
                ck1 = ik
                ik+=1
                ck2 = ik
                BKmeansFE.splitCluster(ci, X, clusters, centroids, ck1, ck2,
                        proxtype, max_iter=max_iter, verbose=verbose);
        end = process_time()
        print ("time BKmeansFE: {:.5f}".format(end-start))


        return clusters, centroids






