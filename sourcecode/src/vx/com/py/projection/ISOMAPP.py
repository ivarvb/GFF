#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Author: Liz M. Huancapaza Hilasaca
# Copyright (c) 2020
# E-mail: lizhh@usp.br


import numpy as np

from sklearn.manifold import Isomap

from vx.com.py.projection.Projection import *

class ISOMAPP(Projection):
    def __init__(self, X=None, p=2):
        super().__init__(X,p)

    def execute(self):
        #X = self.X
        X = np.array(self.X)
        X2 = Isomap(n_components=self.p).fit_transform(X)
        return X2.tolist();
        
