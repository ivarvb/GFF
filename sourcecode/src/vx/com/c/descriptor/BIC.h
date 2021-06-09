/*
# Author: Ivar Vargas Belizario
# Copyright (c) 2020
# E-mail: ivar@usp.br
*/

#ifndef BIC_H
#define	BIC_H

#include <string.h>
#include <stdbool.h> 
#include <stdio.h>
#include <math.h>
#include <float.h>

#include "../image/ImageIO_t.h"

void vx_bic(
    ImageIO_t*& img,
    double *features,
    int size_rows_features,
    int size_cols_features,
    int bins,
    int *offsetx, int *offsety, int size_offset
);
void vx_bicw(
    ImageIO_t*& img,
    double *features,
    int size_rows_features,
    int size_cols_features,
    int bins,
    int *offsetx, int *offsety, int size_offset
);


/* vx_new_double
cdef double* features = <double*> malloc((size_segments*size_features) * sizeof(double))
 */
void vx_bic(
    ImageIO_t*& img,
    double *features,
    int size_rows_features,
    int size_cols_features,
    int bins,
    int *offsetx, int *offsety, int size_offset
){  
    unsigned long i, j, r, c;
    int x, y, k, xj, yj, pi, pj, d, f, xui, xuj;
    double fc, w;
    
    memset(features, 0.0, (size_rows_features*size_cols_features)*sizeof(double));

    fc = (1.0/((double)bins));
    for (r=1; r<img->size_labels;++r){
        i = img->region[r];
        //id[r] = r;
        //target[r] = img->target[i];
        c=0;
        while(c<img->regionsize[r]){
            x = (int)(i % img->width);
            y = (int)((i - x) / img->width);
            for(f=0;f<size_offset;++f){
                xj=x+offsetx[f];
                yj=y+offsety[f];
                if(xj>=0 && xj<img->width && yj>=0 && yj<img->height){
                    j = yj*img->width+xj;
                    if(img->label[j]>0 && img->label[i]==img->label[j]){
                        pi=(int)((img->pixel[i]/256.0)/fc);
                        pj=(int)((img->pixel[j]/256.0)/fc);                            
                        w = 1.0;
                        if(pi == pj){
                            xui = (2*bins*k)+pi;                                   
                            features[r*size_cols_features+ xui ] += w;
                        }
                        else{
                            xui = (2*bins*k)+(bins+pi);
                            xuj = (2*bins*k)+(bins+pj);
                            features[r*size_cols_features+ xui] += w;
                            features[r*size_cols_features+ xuj] += w;
                        }
                    }
                }
            }
            //next pixel in the region
            i = img->next[i];
            c += 1;
        }
    }
}

void vx_bicw(
    ImageIO_t*& img,
    double *features,
    int size_rows_features,
    int size_cols_features,
    int bins,
    int *offsetx, int *offsety, int size_offset
){
    unsigned long i, j, r, c;
    int x, y, k, xj, yj, pi, pj, d, f, xui, xuj;
    double fc, w;
    double gi, gj;
    memset(features, 0.0, (size_rows_features*size_cols_features)*sizeof(double));

    fc = (1.0/((double)bins));
    for (r=1; r<img->size_labels;++r){
        i = img->region[r];
        //id[r] = r;
        //target[r] = img->target[i];
        c=0;
        while(c<img->regionsize[r]){
            x = (int)(i % img->width);
            y = (int)((i - x) / img->width);
            for(f=0;f<size_offset;++f){
                xj=x+offsetx[f];
                yj=y+offsety[f];
                if(xj>=0 && xj<img->width && yj>=0 && yj<img->height){
                    j = yj*img->width+xj;
                    if(img->label[j]>0 && img->label[i]==img->label[j]){
                        gi = (double)img->pixel[i];
                        gj = (double)img->pixel[j];

                        pi=(int)((gi/256.0)/fc);
                        pj=(int)((gj/256.0)/fc);

                        w = gi-gj; 
                        w = sqrt(w*w);
                        if(pi == pj){
                            xui = (2*bins*k)+pi;                                   
                            features[r*size_cols_features+ xui ] += w;
                        }
                        else{
                            xui = (2*bins*k)+(bins+pi);
                            xuj = (2*bins*k)+(bins+pj);
                            features[r*size_cols_features+ xui] += w;
                            features[r*size_cols_features+ xuj] += w;
                        }
                    }
                }
            }
            //next pixel in the region
            i = img->next[i];
            c += 1;
        }
    }
}

#endif

