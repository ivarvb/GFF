#ifndef BKMEANS_H
#define	BKMEANS_H

#include <string.h>
#include <stdbool.h> 
#include <stdio.h>
#include <math.h>
#include <float.h>

//#include "Vector_t.h"

//#include <assert.h>



const char *PROXNAME[]={"Euclidean","Manhattan","Camberra","Chebychev",
                        "Braycurtis","Cosine","Pearson","Gaussian","Correlation" };
const int PROXINDEX[] = { 0, 1, 2, 3, 4, 5, 6, 7, 8};
const int PROXCOEFF[] = { 1, 1, 1, 1, 1,-1,-1,-1,-1};



typedef struct Cluster_t Cluster_t;

Cluster_t* vx_clusters(int n);
typedef struct Cluster_t{
    int size;
    int centroid;
    int medoid;
    int *root;
} Cluster_t;

Cluster_t* vx_clusters(int n){
    Cluster_t* cluster = (Cluster_t*)malloc(sizeof(Cluster_t));
    cluster->size = n;
    cluster->centroid = -1;
    cluster->medoid = -1;
    cluster->root = (int*)calloc(n, sizeof(int));
    int i;
    for (i=0; i<n; ++i){
        cluster->root[i] = i;
    }
    return cluster;
}

void vx_clusters_add(Cluster_t* clust, int e){
    clust->size++;
    clust->root = (int*)realloc(clust->root, clust->size*sizeof(int));
    clust->root[clust->size-1] = e;
}

void vx_clusters_free(Cluster_t* clust){
    free(clust->root);
    free(clust);
    clust = NULL;
}


void vx_bkmeans_execute(DenseMat_t *X, int k, int proxtype, int max_iter){
        Cluster_t *clusters = vx_clusters(k);
        
        DenseMat_t *centroids = vx_densemat(k, X.cols())

        centroids.copyrow(0, X, 0)
        ik = 0
        while len(clusters) < k:
            ci = BKmeansFE.getCluster2Split(clusters)
            if len(clusters[ci].cluster)>1:
                BKmeansFE.splitCluster(ci, X, clusters, centroids, ik,
                        proxtype, max_iter=max_iter, verbose=verbose);
            #print ("k", k)
        #print ("endk")    
        end = process_time()
        print ("time BKmeansFE: {:.5f}".format(end-start))


        # compute centroid         
        #clusters_o = []
        ###centroids_o = []
        #for clu in clusters:
        #    clusters_o.append(clu.cluster)
        #    #centroids_o.append(clu.centroid)

        return clusters, centroids




}


#endif
