#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Author: Ivar Vargas Belizario
# Copyright (c) 2020
# E-mail: ivar@usp.br


import scipy
from scipy.sparse import csc_matrix
from scipy.sparse import csr_matrix

class SparseM2D:
    def __init__ (self):
        self.data = []
        self.rowi = []
        self.coli = []

    def append(self, i, j, d):
        self.data.append(d)
        self.rowi.append(i)
        self.coli.append(j)

    def makeScipySparse(self, rows, cols):
        return scipy.sparse.csr_matrix(     ( self.data, (self.rowi, self.coli) ),
                                            shape=(rows, cols) )
