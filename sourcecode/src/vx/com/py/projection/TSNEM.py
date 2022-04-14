#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Author: Liz M. Huancapaza Hilasaca
# Copyright (c) 2020
# E-mail: lizhh@usp.br

import numpy as np

#from sklearn.manifold import TSNE
from MulticoreTSNE import MulticoreTSNE as TSNE


from vx.com.py.projection.Projection import *

class TSNEM(Projection):
    def __init__(self, X=None, p=2, proxtype="euclidean"):
        self.proxtype = proxtype
        super().__init__(X,p)

    def execute(self):
        #X = self.X
        X = np.array(self.X)


        # X2 = TSNE(n_components=self.p, random_state=7, perplexity=40).fit_transform(X)
        # return X2.tolist();
        print("self.proxtype", self.proxtype)
        X2 = tsne = TSNE(n_jobs=4, metric=self.proxtype, n_components=self.p, random_state=7, perplexity=10).fit_transform(X)
        return X2.tolist();
        
