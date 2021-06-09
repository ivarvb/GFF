#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Author: Ivar Vargas Belizario
# Copyright (c) 2020
# E-mail: ivar@usp.br


import pandas as pd
import numpy as np

class CSVData:
    def __init__(self, filename):
        self.df = pd.read_csv(filename, delimiter=",")        
        self.columns = self.df.columns.tolist()

    def __del__ (self):
        del self.df
        del self.columns

    def getcolumn(self, colname):
        return self.df[colname].tolist()

    def getrow(self, rowname):
        pass
