#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Author: Liz M. Huancapaza Hilasaca
# Copyright (c) 2020
# E-mail: lizhh@usp.br

import numpy as np
from sklearn.manifold import MDS

from vx.com.py.projection.Projection import *

class MDSP(Projection):
    def __init__(self, X=None, p=2):
        # self.X = X
        # self.p = p
        super().__init__(X,p)

    def execute(self):
        #X = np.array(self.X)
        X = self.X
        mds = MDS(n_components=self.p, random_state=7)
        Xt = mds.fit_transform(X)
        X2 = Xt.tolist();
        return X2



