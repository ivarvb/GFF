#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Author: Liz M. Huancapaza Hilasaca
# Copyright (c) 2020
# E-mail: lizhh@usp.br

import numpy as np

import umap

from vx.com.py.projection.Projection import *

class UMAPP(Projection):
    def __init__(self, X=None, p=2, proxtype="euclidean"):
        self.X = X
        self.p = p
        self.proxtype = proxtype
        super().__init__(X,p)

    def execute(self):
        X = self.X
        #X = np.array(self.X)
        print("umap",self.proxtype)
        X2 = umap.UMAP(n_components=self.p, metric=self.proxtype, random_state=7).fit_transform(X)
        return X2.tolist();