#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Author: Liz M. Huancapaza Hilasaca
# Copyright (c) 2020
# E-mail: lizhh@usp.br


import math
import random

import queue as Q

from time import process_time 


from vx.com.py.proximity.Proximity import *

class BKmeans:
    def __init__(self):
        pass

    @staticmethod
    def getCluster2Split(clusters):
        ci = 0
        for i in range(len(clusters)):
            if len(clusters[i])>len(clusters[ci]):
                ci = i
        return ci;
    
    @staticmethod
    def getq(q, ir):
        i = 0
        e = None
        while not q.empty():
            e = q.get()
            if i==ir:
                break;
            i += 1
        return e


    @staticmethod
    def getPivots(X, cluster, centroid, proxtype):
        pivots = [-1, -1];

        #mean = BKmeans.computeMean(matrix, cluster);
        mean = centroid
        size = int(1 + (len(cluster) / 10));

        # choosing the first pivot
        # pivots_aux = Q.PriorityQueue()
        paux = []
        for i in range(size):
            el = int((len(cluster) / size) * i)
            j = cluster[el]
            d = Proximity.compute(mean, X[j], proxtype);
            paux.append((d, j));
        paux.sort(key = lambda x: x[0])
        pivots[0] = paux[int(len(paux) * 0.75)][1]
        #del pivots_aux
        
        # choosing the second pivot
        # pivots_aux = Q.PriorityQueue()
        paux = []
        for i in range(size):
            el = int((len(cluster) / size) * i)
            j = cluster[el]
            d = Proximity.compute(X[pivots[0]], X[j], proxtype);
            paux.append((d, j));
        paux.sort(key = lambda x: x[0])
        pivots[1] = paux[int(len(paux) * 0.75)][1];
        #del pivots_aux
        return pivots;
    
    @staticmethod
    def computeMean(X, cluster):
        n = len(X[0])
        z = len(cluster)
        mean = [0.0 for i in range(n)]

        for i in cluster:
            for j in range(n):
                mean[j] += (X[i][j]/z)
        print("mean",mean)
        return mean

    @staticmethod
    def computeMedoid(X, cluster, centroids, proxtype):
        mind = float('inf') 
        imed = -1
        for i in cluster:
            d = Proximity.compute(X[i], centroids, proxtype)
            if d<mind:
                imed = i
                mind = d
        return imed

    @staticmethod
    def splitCluster(ci, X, clusters, centroids,
                    proxtype="euclidean", max_iter=100, verbose=False):

        cluster = clusters.pop(ci)
        centroid = centroids.pop(ci)

        # getting the two pivots
        pivots = BKmeans.getPivots(X, cluster, centroid, proxtype)

        # cluster = Util.shuffle(cluster)

        # clus1, clus2 = [cluster[0]], [cluster[1]]
        clus1, clus2 = [pivots[0]], [pivots[1]]
        cent1, cent2 = X[pivots[0]], X[pivots[1]]
        it = 0
        while True:
            cent1 = BKmeans.computeMean(X, clus1)
            cent2 = BKmeans.computeMean(X, clus2)

            clus1 = []
            clus2 = []

            for i in cluster:
                d1 = Proximity.compute(X[i], cent1, proxtype)
                d2 = Proximity.compute(X[i], cent2, proxtype)

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

            
            it = it+1
            #print(ci, it, len(clusters),)
            if not it < max_iter:
                break;
            
        #Add the two new clusters
        clusters.append(clus1);
        clusters.append(clus2);

        #add the new centroids
        #update centroids
        cent1 = BKmeans.computeMean(X, clus1)
        cent2 = BKmeans.computeMean(X, clus2)
        centroids.append(cent1);
        centroids.append(cent2);


    @staticmethod
    def execute(X=None, k=2, proxtype="euclidean", max_iter=15, verbose=False):
        # XFE selectrows


        start = process_time()
        initcluster = [ i for i in range(len(X))]
        clusters = [initcluster]
        centroids = [ X[initcluster[0]] ]

        while len(clusters) < k:
            ci = BKmeans.getCluster2Split(clusters)
            if len(clusters[ci])>1:
                BKmeans.splitCluster(ci, X, clusters, centroids,
                        proxtype=proxtype, max_iter=max_iter, verbose=verbose);
            #print ("k", k)
        #print ("endk")    
        end = process_time()
        print ("time BKmeans: {:.5f}".format(end-start))


        return clusters, centroids


