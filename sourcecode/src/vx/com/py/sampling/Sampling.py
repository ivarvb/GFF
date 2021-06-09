#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Author: Ivar Vargas Belizario
# Copyright (c) 2020
# E-mail: ivar@usp.br

import random

from vx.com.py.clustering.BKmeans import *
from vx.com.py.clustering.BKmeansFE import *

class Sampling:
    # input: smsize, X, type
    # output: ramdoms ids
    @staticmethod
    def execute(X=None, smsize=None, types=None, proxtype="euclidean"):
        smpid = []
        clusterscentroids = None        
        if types == "random":
            random.seed(7)
            e = [ i for i in range(len(X)) ]
            random.shuffle(e) 
            for i in e:
                smpid.append(i)
                if len(smpid)==smsize:
                    break
                
        elif types == "clusteringmedoids":
            clusters, centroids = BKmeans.execute(X, smsize, proxtype)
            for i in range(len(clusters)):
                cs = clusters[i]
                ce = centroids[i]
                idme = BKmeans.computeMedoid(X, cs, ce, proxtype)
                smpid.append(idme)
            clusterscentroids = (clusters, centroids) 
        return smpid, clusterscentroids


    @staticmethod
    def executeFE(X=None, smsize=None, types=None, proxtype=0):
        smpid = []
        clusterscentroids = None        
        if types == "random":
            #random.seed(7)
            #e = [ i for i in range(len(X)) ]
            #random.shuffle(e) 
            #for i in e:
            #    smpid.append(i)
            #    if len(smpid)==smsize:
            #        break
            pass
                
        elif types == "clusteringmedoids":
            clusters, centroids = BKmeansFE.execute(X, smsize, proxtype)
            for clu in clusters:
                cs = clu.cluster
                ce = clu.centroid
                clu.medoid = BKmeansFE.computeMedoid(X, cs, centroids, ce, proxtype)
                smpid.append(clu.medoid)
            clusterscentroids = (clusters, centroids) 
        return smpid, clusterscentroids
