import math
import queue as Q

from time import process_time

from vx.com.py.proximity.Proximity import *

class KNN:
    
    def __init__(self):
        pass
    
    @staticmethod
    def execute(nneighbors, X, proxtype):
        start = process_time()

        n = len(X);
        #pmat = PMatrix(n);
        ne = [Q.PriorityQueue() for i in range(n)]
        for i in range(n):
            for j in range(i+1, n):
                d = Proximity.compute(X[i], X[j], proxtype)
                ne[i].put((d, j))
                ne[j].put((d, i))
                print("dddddddddddddddd",d)
        ner = [ [] for i in range(n)]
        for i in range(n):
            q = ne[i]
            while not q.empty():
                d, j = q.get()
                ner[i].append([j,d])
                if len(ner[i])==nneighbors:
                    break;
        del ne
        end = process_time()
        #print ("nernernernernernernernernernerner0000000",ner, nneighbors)
        print ("time KNN: {:.5f}".format(end-start))

        return ner


