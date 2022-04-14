#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Author: Liz M. Huancapaza Hilasaca
# Copyright (c) 2020
# E-mail: lizhh@usp.br

from abc import ABC, abstractmethod

class Projection(ABC):

    def __init__(self, X=None, p=2):
        self.X = X
        self.p = p

    def setX(self, X):
        self.X = X

    @abstractmethod
    def execute(self):
        print("Some implementation!")

    # @staticmethod
    # def execute(X, type):
    #     X = np.array(X)
    #     print(X.shape)
    #     proj = []
    #     if type=="MDS":
    #         mds = MDS(n_components=2)
    #         Xt = mds.fit_transform(X)
    #         proj = Xt.tolist();
    #     elif type=="SMP":
    #         proj = SMP(X,p);
    #     return proj;


