#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Author: Liz M. Huancapaza Hilasaca
# Copyright (c) 2020
# E-mail: lizhh@usp.br

# Adapted from: #http://gromgull.net/2009/08/fastmap.py

import math
import random
import scipy
import numpy as np

from vx.com.py.projection.Projection import *
from vx.com.py.proximity.Proximity import *

class FASTMAPP(Projection):
    def __init__(self, X=None, dist=None, proxtype="euclidean", p=2): 
        self.dist=dist
        self.proxtype = proxtype
        self.DISTANCE_ITERATIONS=1
        super().__init__(X,p)

    def execute(self):
        projection_aux = [ [0.0,0.0] for i in range(len(self.X))]
        if len(self.X) > 4:
            FASTMAPP.project(self.X, self.proxtype, projection_aux, 0)
            FASTMAPP.project(self.X, self.proxtype, projection_aux, 1)
        else:
            print("Not supported yet.")
            exit()

        return projection_aux
    
    @staticmethod
    def project(X, proxtype, projection, dimension):
        # choosen pivots for this recursion
        lvchoosen = FASTMAPP.chooseDistantObjects(X, proxtype, projection, dimension)
        lvdistance = FASTMAPP.distance(X[lvchoosen[0]], X[lvchoosen[1]],
                projection[lvchoosen[0]], projection[lvchoosen[1]], proxtype, dimension)

        # if the distance between the pivots is 0, then set 0 for each instance
        # for this dimension
        if lvdistance == 0:
            # for each instance in the table
            for lvi in range(len(projection)):
                projection[lvi][dimension] = 0.0
        else: #//if the distance is not equal to 0, then
            #//instances iterator
            for lvi in range(len(projection)):
                dist_lvchoosen0_lvi = FASTMAPP.distance(X[lvchoosen[0]], X[lvi],
                        projection[lvchoosen[0]], projection[lvi], proxtype, dimension)

                dist_lvchoosen0_lvchoosen1 = FASTMAPP.distance(X[lvchoosen[0]], X[lvchoosen[1]],
                        projection[lvchoosen[0]], projection[lvchoosen[1]], proxtype, dimension)

                dist_lvchoosen1_lvi = FASTMAPP.distance(X[lvchoosen[1]], X[lvi],
                        projection[lvchoosen[1]], projection[lvi], proxtype, dimension)

                lvxi = ((math.pow(dist_lvchoosen0_lvi, 2)
                        + math.pow(dist_lvchoosen0_lvchoosen1, 2)
                        - math.pow(dist_lvchoosen1_lvi, 2))
                        / (2 * dist_lvchoosen0_lvchoosen1))

                projection[lvi][dimension] = lvxi;

    @staticmethod
    def chooseDistantObjects(X, proxtype, projection, dimension):
        random.seed(7)

        choosen = [0,0]
        pivot1, pivot2 = 0, 0

        size = len(X)
        maxv = float('-inf')

        for k in range(5):
            initialpivot = int(random.random() * (len(X) - 1))
            max_aux = float('-inf');
            for i in range(size):
                dist = FASTMAPP.distance(X[initialpivot], X[i],
                        projection[initialpivot], projection[i], proxtype, dimension)
                if dist > max_aux:
                    max_aux = dist
                    pivot1 = i

            max_aux = float('-inf')
            for i in range(size):
                dist = FASTMAPP.distance(X[pivot1], X[i],
                        projection[pivot1], projection[i], proxtype, dimension)
                if dist > max_aux:
                    max_aux = dist;
                    pivot2 = i;

            if max_aux > maxv:
                choosen[0] = pivot1
                choosen[1] = pivot2

        return choosen
    
    @staticmethod
    def distance(v1, v2, p1, p2, proxtype, dimension):
        dist = Proximity.compute(v1, v2, proxtype);
        for i in range(dimension):
            coord1 = p1[dimension - 1]
            coord2 = p2[dimension - 1]
            dd = math.pow( Proximity.compute(v1, v2, proxtype), 2) - math.pow((coord1 - coord2), 2)
            return math.sqrt(abs( dd ))
        return dist


