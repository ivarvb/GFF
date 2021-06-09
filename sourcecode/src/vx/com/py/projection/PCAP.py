#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Author: Liz M. Huancapaza Hilasaca
# Copyright (c) 2020
# E-mail: lizhh@usp.br


import numpy as np

#from sklearn.manifold import PCA
from sklearn.decomposition import PCA

from vx.com.py.projection.Projection import *

class PCAP(Projection):
    def __init__(self, X=None, p=2):
        # self.X = X
        # self.p = p
        super().__init__(X, p)

    def execute(self):
        X = self.X
        #X = np.array(self.X)

        pca = PCA(n_components = self.p,svd_solver = 'randomized')
        pca.fit(X)
        X2 = pca.transform(X)
        print(X2)
        return X2
        
