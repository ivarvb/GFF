import math
import queue as Q

from time import process_time

from vx.com.py.proximity.Proximity import *

class KNNFE:
    
    def __init__(self):
        pass
    
    @staticmethod
    def execute(nneighbors, clusters, X, proxtype):
        start = process_time()

        n = len(clusters);
        #pmat = PMatrix(n);
        ne = [Q.PriorityQueue() for i in range(n)]
        for i in range(n):
            ci = clusters[i].centroid
            for j in range(i+1, n):
                cj = clusters[j].centroid

                d = X.proximity_row_ij(ci, cj, proxtype)
                # print("dddddddddddddddd",d)
                ne[i].put((d, j))
                ne[j].put((d, i))
                # for c in range(X.cols()):
                #     print (X.getValue(ci, c), X.getValue(cj, c), ci, cj);
                # print("X")

        ner = [ [] for i in range(n)]
        for i in range(n):
            q = ne[i]
            while not q.empty():
                d, j = q.get()
                ner[i].append([j,d])
                if len(ner[i])==nneighbors:
                    break;
        del ne
        #print ("nernernernernernernernernernerner",ner, nneighbors)
        end = process_time()
        print ("time KNNFE: {:.5f}".format(end-start))

        return ner


