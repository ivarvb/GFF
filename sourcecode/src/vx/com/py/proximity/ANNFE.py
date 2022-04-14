import math
import queue as Q

from vx.com.py.clustering.BKmeans import *
from vx.com.py.proximity.KNNFE import *
from vx.com.px.dataset.dataio import ProximityMatrix

#from vix.py.proximity.Proximity import *

class ANNFE:
    
    def __init__(self):
        pass
    
    @staticmethod
    def execute(nneighbors, X, proxtype, clusterscentroids=None):
        clusters, centroids = clusterscentroids;
        
        n = X.rows()
        ne = [ Q.PriorityQueue() for i in range(n)]

        nclusneig = max(5, int(math.sqrt( len(clusters)*math.sqrt(nneighbors) ) ) );
        nclusneig = min( nclusneig*2, len(clusters)-1);

        #print("being cluss neig KNN")
        neclus = KNNFE.execute(nclusneig, clusters, centroids, proxtype);
        #print("end cluss KNN")

        # dmat = PMatrix(n)
        pmat = ProximityMatrix(n, -1.0, 1)
        #print("BEGIN BUCLE")
        for g in range(len(clusters)):
            c = clusters[g].cluster
            for e in range(len(c)):
                i = c[e];
                # compute distance between elements
                for f in range(e+1, len(c)):
                    j = c[f];
                    #d = 0.0;
                    if pmat.getValue(i,j)==-1.0:
                        d = X.proximity_row_ij(i, j, proxtype);
                        pmat.setValue(i,j,d);
                        ne[i].put((d, j))
                        ne[j].put((d, i))

                # definir a quantidade de clusters a visitar
                nclust2visit = 1;
                count = len(c) - 1;
                for j, w in neclus[g]:
                    count += len(clusters[j].cluster);
                    if count > nneighbors:
                        break;
                    else:
                        nclust2visit+=1;

                nclust2visit = nclust2visit if nclust2visit > nclusneig else nclusneig;
                # computar distancias para os j cluster-elements vizinhos de i
                for e, d in neclus[g][:nclust2visit]:
                    for j in clusters[e].cluster:
                        if i == j:
                            continue
                        if pmat.getValue(i,j)==-1.0:
                            d = X.proximity_row_ij(i, j, proxtype);
                            pmat.setValue(i,j,d);
                            ne[i].put((d, j))
                            ne[j].put((d, i))
                
        del pmat


        ner = [ [] for i in range(n)]
        for i in range(n):
            q = ne[i]
            while not q.empty():
                d, j = q.get()
                ner[i].append([j,d])
                if len(ner[i])==nneighbors:
                    break;
        del ne
        #print ("END ANN")
        return ner



