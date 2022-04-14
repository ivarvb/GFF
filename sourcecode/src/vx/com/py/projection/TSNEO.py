#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Author: Liz M. Huancapaza Hilasaca
# Copyright (c) 2020
# E-mail: lizhh@usp.br

import numpy as np

from openTSNE import TSNE

from vx.com.py.projection.Projection import *

class TSNEO(Projection):
    def __init__(self, X=None, p=2):
        super().__init__(X,p)

    def execute(self):
        X = self.X
        X = np.array(self.X)
        #print("XXn",len(X))
        X2 = TSNE(n_components=self.p, random_state=7, perplexity=33).fit(X)
        print("X2fit",X2)
        return X2.tolist();
