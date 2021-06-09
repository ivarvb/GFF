# distutils: language = c

# Author: Ivar Vargas Belizario
# Copyright (c) 2020
# E-mail: ivar@usp.br

import glob
import os
#import soundfile as sf
#import librosa
import os.path
import math

import os
from typing import List
import numpy as np
cimport numpy as np

from libc.stdlib cimport calloc, free
from libc.stdlib cimport malloc, free
from libc.stdio cimport *

import random
import time
import math
import sys

cdef extern from "./c/data/import.h":
    ctypedef struct DenseMat_t:
        int rows
        int cols
        double *data

    DenseMat_t* vx_densemat(int rows, int cols);
    void vx_densemat_realloc(DenseMat_t* dat, int rows, int cols);

    DenseMat_t* vx_densemat_from_csv(char filename[], int* colsids, int sizecolsids);
    void vx_densemat_free(DenseMat_t* dat);
    void vx_densemat_set(DenseMat_t *dat, int row, int col, double v);
    double vx_densemat_get(DenseMat_t *dat, int row, int col);
    DenseMat_t* vx_densemat_transform(DenseMat_t* dat, int bins, int transpose);
    DenseMat_t* vx_densemat_transpose(DenseMat_t* dat);
    DenseMat_t* vx_densemat_select_cols(DenseMat_t* dat, int* colsids, int sizecols);
    DenseMat_t* vx_densemat_select_rows(DenseMat_t* dat, int* rowsids, int sizerows);
    void vx_densemat_fill_row(DenseMat_t* dat, int r, double fill);
    void vx_densemat_fill_col(DenseMat_t* dat, int c, double fill);
    void vx_densemat_copy_row(DenseMat_t* dati, int rowi, DenseMat_t* datj, int rowj);
    void vx_densemat_normalization_col(DenseMat_t* dat, int c, int pt);
    void vx_densemat_normalization_row(DenseMat_t* dat, int r, int pt);

    ctypedef struct ProxMat_t:
        int rows
        int cols
        double *data
        
    ProxMat_t* vx_proxmat(int n, double init, int isinit);
    void vx_proxmat_free(ProxMat_t* dat);
    double vx_proxmat_get(ProxMat_t* mat, int i, int j);
    void vx_proxmat_set(ProxMat_t* mat, int i, int j, double v);
    ProxMat_t* vx_proxmat_from_densemat_rows(DenseMat_t* dat, int pt);
    ProxMat_t* vx_proxmat_from_densemat_cols(DenseMat_t* dat, int pt);
    double vx_proximity_rows(DenseMat_t* dat, int i, int j, int pt);
    double vx_proximity_cols(DenseMat_t* dat, int i, int j, int pt);
    
    double vx_proximity_two_densemat_rows(DenseMat_t* dati, DenseMat_t* datj, int i, int j, int pt);




cdef class DataMatrix:
    cdef DenseMat_t* _dat
    cdef _trueids
    cdef _feids
    cdef _featuresnames
    cdef _featuresnames_index
    def __cinit__(self, filecsv="None", unselectedfeids=[]):
        cdef char* filecsv_c;
        cdef int *cfeids;
        
        if filecsv!="None":
            try:
                f = open(filecsv, mode="r",  encoding='utf-8-sig')
                self._featuresnames_index = f.readline().split(",")
                self._featuresnames_index = [x.strip() for x in self._featuresnames_index]
                f.close()            
            except ValueError:
                print ("Oops!  error, open filecsv."+ValueError)
            
            self._feids = [i for i in range(len(self._featuresnames_index))]
            self._trueids = [i for i in range(len(self._featuresnames_index))]

            if len(unselectedfeids)>0:
                ids = [1 for i in range(len(self._featuresnames_index))]
                self._trueids = [-1 for i in range(len(self._featuresnames_index))]
                for i in unselectedfeids:
                    ids[i] = 0

                auxfe = []
                self._feids = []
                ix = 0;
                for i in range(len(ids)):
                    if ids[i] == 1:
                        auxfe.append(self._featuresnames_index[i])
                        self._feids.append(i)
                        self._trueids[i] = ix
                        ix+=1

                self._featuresnames_index = auxfe

            n = len(self._feids)
            cfeids = <int*>malloc(n*sizeof(int))
            for i in range(len(self._feids)):
                cfeids[i] = self._feids[i]

            filecsv = filecsv.encode('UTF-8')
            filecsv_c = filecsv

            self._featuresnames = { self._featuresnames_index[i].strip():i for i in range(len(self._featuresnames_index)) }
            self._dat = vx_densemat_from_csv(filecsv_c, cfeids, n)
            free(cfeids);
        else:
            self._dat = vx_densemat(0,0);

    def __dealloc__(self):
        vx_densemat_free(self._dat);
    
    def create(self, rows, cols):
         vx_densemat_realloc(self._dat, rows, cols);

    #id real return id in matrix
    def trueids(self):
        return self._trueids

    #id in matrix return id in real
    def shifttrueids(self):
        return self._feids

    def columnsindexes(self):
        return self._featuresnames;
    
    def columnindex(self, c):
        return self._featuresnames[c];

    def columns(self):
        cls = []
        for k,v in self._featuresnames.items():
            cls.append(k)
        return cls

    def columns_index(self):
        return self._featuresnames_index;


#    def targetscols(self):
#        return self._targetscols
        
    def tolist(self):
        res = []
        for r in range(self.rows()):
            row = []
            for c in range(self.cols()):
                row.append( vx_densemat_get(self._dat, r, c) )
            res.append(row)
        return res

    def proximitymatrix_rows(self, ptn="Euclidean"):
        pm = ProximityMatrix(ptn=ptn)
        pm._mat = vx_proxmat_from_densemat_rows(self._dat, pm.pti);
        return pm

    def proximitymatrix_cols(self, ptn="Euclidean"):
        pm = ProximityMatrix(ptn=ptn)
        pm._mat = vx_proxmat_from_densemat_cols(self._dat, pm.pti);
        return pm

    def proximity_rows(self, i, j, pt):
        return vx_proximity_rows(self._dat, i, j, pt);
    
    def proximity_cols(self, i, j, pt):
        return vx_proximity_cols(self._dat, i, j, pt);
    
    def normalization_col(self, c, pt):
        return vx_densemat_normalization_col(self._dat, c, pt);

    def normalization_row(self, r, pt):
        return vx_densemat_normalization_row(self._dat, r, pt);
    
#    def transform(self, bins=10, transpose=0):
#        other = DataMatrix();
#        other._dat = transform_t(<Data_t*>self._dat, bins, transpose)
#        return other   
    
    def transpose(self):
        other = DataMatrix();
        other._dat = vx_densemat_transpose(<DenseMat_t*>self._dat)
        other._featuresnames = {"c"+str(i):i for i in range(self.rows())}
        return other
    
    def selectcolumns(self, featurescols):
        n = len(featurescols)
        other = DataMatrix();
        cdef int *ids = <int*>malloc(n*sizeof(int))
        newfecols_index = []
        newfecols = {}
        i = 0;
        for c in featurescols:
            ids[i] = self._featuresnames[c];
            newfecols_index.append(c)
            newfecols[c] = i;
            i += 1
        
        other._dat = vx_densemat_select_cols(<DenseMat_t*>self._dat, ids, n);

        other._featuresnames_index = newfecols_index;
        other._featuresnames = newfecols;

        free(ids);
        return other;

    def selectcolumns_index(self, featurescols_index):
        n = len(featurescols_index)
        other = DataMatrix();
        cdef int *ids = <int*>malloc(n*sizeof(int))
        newfecols_index = []
        newfecols = {}
        i = 0;
        for index in featurescols_index:
            c = self._featuresnames_index[index];
            ids[i] = index;
            newfecols_index.append(c)
            newfecols[c] = i;
            i += 1
        
        other._dat = vx_densemat_select_cols(<DenseMat_t*>self._dat, ids, n);

        other._featuresnames_index = newfecols_index;
        other._featuresnames = newfecols;

        free(ids);
        return other;

    def selectrows(self, idrows):
        n = len(idrows)
        
        other = DataMatrix();
        cdef int *ids = <int*>malloc(n*sizeof(int))
        i = 0
        for r in idrows:
            ids[i] = r;
            i += 1
        
        other._dat = vx_densemat_select_rows(<DenseMat_t*>self._dat, ids, n);

        other._featuresnames = self._featuresnames.copy();
        free(ids);
        return other;

    def copyrow(self, rowi, densemat, rowj):
        vx_densemat_copy_row(self._dat, rowi, (<DataMatrix>densemat)._dat, rowj);


    def fillrow(self, r, fill):
        vx_densemat_fill_row(self._dat, r, fill)

    def fillcol(self, c, fill):
        vx_densemat_fill_col(self._dat, c, fill)

    def getcolumn(self, ci):
        return self.getcolumn_index(self._featuresnames[ci])
        
    def getcolumn_index(self, c):
        #c = self._featuresnames[ci]
        minc = float("inf")
        maxc = -float("inf")
        X = []
        for r in range(self.rows()):
            v = vx_densemat_get(self._dat, r, c)
            X.append(v)
            if v<minc:
                minc = v
            if v>maxc:
                maxc = v
        return X, minc, maxc

    def setValue(self, i, j, v):
        vx_densemat_set(self._dat, i, j, v);
    
#    def getValue(self, i, j):
#        return 0.0 if i == j else get_t(self._dat, i, j)
    def getValue(self, i, j):
        return vx_densemat_get(self._dat, i, j)
#        return ;
    
    def rows(self):
        return (<DenseMat_t*>self._dat).rows;

    def cols(self):
        return (<DenseMat_t*>self._dat).cols;
    
    
    def show(self):
        for i in range(self._dat.rows):
            for j in range(self._dat.cols):
                print (self.getValue(i,j)),
            print ("")

    def proximity_row(self, i, other, j, proxtype):
        return vx_proximity_two_densemat_rows(  self._dat,
                                                (<DataMatrix>other)._dat,
                                                i, j, proxtype);


    def proximity_row_ij(self, i, j, proxtype):
        return vx_proximity_two_densemat_rows(  self._dat,
                                                self._dat,
                                                i, j, proxtype);




cdef class ProximityMatrix:
    cdef ProxMat_t* _mat
    cdef ptn
    

    cdef pti    
    cdef cei
#    cdef double _minv;
#    cdef double _maxv;
    POT =  {   "Euclidean":0,"Manhattan":1,"Camberra":2,"Chebychev":3,
                            "Braycurtis":4,"Cosine":5,"Pearson":6,"Gaussian":7,"Correlation":8,"DCosine":9,
                        }
    CEF =  {   "Euclidean":1,"Manhattan":1,"Camberra":1,"Chebychev":1,
                            "Braycurtis":1,"Cosine":-1,"Pearson":-1,"Gaussian":-1,"Correlation":-1,"DCosine":1,
                        }

    def __cinit__(self, N=None, init=0.0, isinit=0, ptn="Euclidean"):
        self.ptn = ptn;

        self.pti = ProximityMatrix.POT[self.ptn];
        self.cei = ProximityMatrix.CEF[self.ptn];
        if N != None:
            self._mat = vx_proxmat(N, init, isinit)
              
    def __dealloc__(self):
        vx_proxmat_free(self._mat);

    def getValue(self, i, j):
        return vx_proxmat_get(self._mat, i, j)
    
    def setValue(self, i, j, v):
        vx_proxmat_set(self._mat, i, j, v)
    
    def getCoefficient(self):
        return self.cei
