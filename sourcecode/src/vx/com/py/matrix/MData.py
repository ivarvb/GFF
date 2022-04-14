#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Author: Ivar Vargas Belizario
# Copyright (c) 2020
# E-mail: ivar@usp.br


import pandas as pd
import numpy as np

class MData:
    def __init__(self, X=[], columns=[], columnsi={}):
        self.X = X
        self.columns = columns
        self.columns_i = columnsi
        # add columns adn columnsi when are null

    def getData(self):
        return self.X
    
    def getColumns(self):
        return self.columns 

    def sample(self, smp_rows=None, smp_cols=None):
        X = []

        cols_i = None
        if smp_cols != None:
            cols_i = []
            for c in smp_cols:
                cols_i.append(self.columns_i[c])

        X = MData.samplex(self.X, smp_rows, cols_i)

        if smp_cols != None:
            colsi = {str(smp_cols[i]):i for i in range(len(smp_cols))}
            
        md = MData(X, smp_cols, colsi)
        return md;

    @staticmethod
    def samplex(X, smp_r=None, smp_c=None):
        S = []
        if smp_r!=None and smp_c==None:
            for i in smp_r:
                S.append(X[i])
        if smp_r==None and smp_c!=None:
            for i in range(len(X)):
                row = []
                for j in smp_c:
                    row.append(X[i][j])
                S.append(row)
                
        if smp_r!=None and smp_c!=None:
            for i in smp_r:
                row = []
                for j in smp_c:
                    row.append(X[i][j])
                S.append(row)
        return S

    # output: id of poin of controls
    @staticmethod
    def openfilecsv(filename):
        df = pd.read_csv(filename, delimiter=",")
        
        columns = df.columns.tolist()
        columns_aux = []
        for col in columns:
            if col != "INDEXIDUID_":
                columns_aux.append(col)
        columns = columns_aux
        df = df[columns]
        
        #print("df.columns.tolist()", df.columns.tolist())

        cat_columns = df.select_dtypes(['object']).columns
        df[cat_columns] = df[cat_columns].astype('category')
        for col in cat_columns:
            df[col] = df[col].cat.codes        

        X = [];
        for index, row in df.iterrows():
            rw = []
            for k, v in row.items():
                rw.append(v)
            X.append(rw)

        columns_i = {str(columns[i]):i for i in range(len(columns))}

        md = MData(X, columns, columns_i)
        return md

    # input: smpsize, fematrix, prox
    # output: id of poin of controls
    @staticmethod
    def openfiledata(file):
        X = []
        featurenames = []
        ids = []
        targets = []
        
        f = open(file, "r")
        dtype = (f.readline()).strip()

        if dtype=="SY":
            rows = int(f.readline().strip())
            cols = int(f.readline().strip())

            X = [[0.0 for j in range(cols)] for i in range(rows)];
            ids = [["" for j in range(cols)] for i in range(rows)];
            targets = [ 0.0 for i in range(rows)];
            featurenames = f.readline().strip()
            featurenames = featurenames.split(";")
            featurenames = [x.strip() for x in featurenames]
            ir = 0
            while True:
                line = f.readline().strip()
                if not line:
                    break;
                line = line.strip()
                words = line.split(";")
                ids[ir] = str(words[0])
                targets[ir] = float(words[len(words)-1])
                for i in range(1,len(words)-1):
                    j,v = words[i].split(":");
                    X[ir][int(j)] = float(v)
                ir += 1
        elif dtype=="DY":
            rows = f.readline()
            cols = f.readline()
            X = [[0.0 for j in range(cols)] for i in range(rows)];
            ids = [["" for j in range(cols)] for i in range(rows)];
            targets = [ "" for i in range(rows)];
            featurenames = f.readline()
            featurenames = featurenames.split(";")
            featurenames = [x.strip() for x in featurenames]
            ir = 0
            while True:
                line = f.readline()
                if not line:
                    break;
                line = line.strip()
                words = line.split(";")
                ids[ir] = str(words[0])
                targets[ir] = float(words[len(words)-1])
                for j in range(1,len(words)-1):
                    X[ir][j-1] = float(words[i])
                ir += 1
        else:
            pass
        f.close()
        return X, featurenames, ids, targets
        
    # input: smpsize, fematrix, prox
    # output: id of poin of controls
    @staticmethod
    def converdata2csv(filedata,filecsv):
        X, featurenames, ids, targets = MData.openfiledata(filedata)
        lines = "INDEXIDUID_,"
        lines += ",".join(featurenames)
        lines += ",TARGETDUID_\n";
        for i in range(len(X)):
            lines += str(ids[i])+","
            row = [str(x) for x in X[i]]
            lines += ",".join(row)
            lines += ","+str(targets[i])+"\n";
        ofile = open(filecsv, 'w')
        ofile.write(lines)
        ofile.close()

        
    # /mnt/sda1/software/desktop/java/pex-1.6.3_src/ProjectionExplorer/test/data/cbrilpirson.data
        
    

