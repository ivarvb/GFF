import math
import queue as Q

from vx.com.py.clustering.BKmeans import *
from vx.com.py.proximity.KNN import *
from vx.com.py.proximity.Proximity import *

class ANN:
    
    def __init__(self):
        pass
    
    @staticmethod
    def execute(nneighbors, X, proxtype, clusterscentroids=None):
        #print ("BEGIN ANN")
        clusters, centroids = None, None
        if clusterscentroids!=None:
            clusters, centroids = clusterscentroids;
        else:
            k = int(math.pow(len(X), 0.75))
            clusters, centroids = BKmeans.execute(X, k, proxtype);

        n = len(X)
        ne = [ Q.PriorityQueue() for i in range(n)]

        nclusneig = max(5, int(math.sqrt( len(clusters)*math.sqrt(nneighbors) ) ) );
        nclusneig = min( nclusneig*2, len(clusters)-1);

        #print("being cluss neig KNN")
        neclus = KNN.execute(nclusneig, centroids, proxtype);
        #print("end cluss KNN")

        dmat = PMatrix(n)
        #print("BEGIN BUCLE")
        for g in range(len(clusters)):
            c = clusters[g]
            for e in range(len(c)):
                i = c[e];
                # compute distance between elements
                for f in range(e+1, len(c)):
                    j = c[f];
                    #d = 0.0;
                    if dmat.get(i,j)==None:
                        d = Proximity.compute(X[i], X[j], proxtype);
                        dmat.set(i,j,d);
                        ne[i].put((d, j))
                        ne[j].put((d, i))

                # definir a quantidade de clusters a visitar
                nclust2visit = 1;
                count = len(c) - 1;
                for j, w in neclus[g]:
                    count += len(clusters[ j ]);
                    if count > nneighbors:
                        break;
                    else:
                        nclust2visit+=1;

                nclust2visit = nclust2visit if nclust2visit > nclusneig else nclusneig;
                #if nclust2visit > nclusneig:
                #    nclust2visit = nclusneig
                    
                #else nclusneig;
                #print(count, nneighbors, nclust2visit)

                # computar distancias para os j cluster-elements vizinhos de i
                for e, d in neclus[g][:nclust2visit]:
                    for j in clusters[e]:
                        if i == j:
                            continue
                        if dmat.get(i,j)==None:
                            d = Proximity.compute(X[i], X[j], proxtype);
                            dmat.set(i,j,d);
                            ne[i].put((d, j))
                            ne[j].put((d, i))
                
                #print("c, nrtovisit",g, nclust2visit, nneighbors)
        #print("END BUCLE")
        del dmat


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



