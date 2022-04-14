/*
# Author: Ivar Vargas Belizario
# Copyright (c) 2021
# E-mail: ivar@usp.br
*/

#ifndef GLCM_H
#define	GLCM_H

#include <string.h>
#include <stdbool.h> 
#include <stdio.h>
#include <math.h>
#include <float.h>


#include "../image/ImageIO_t.h"
#include "../matrix/DenseMatrix_t.h"

//declares
void vx_glcm(
    ImageIO_t* img, double *features,
    int size_rows_features, int size_cols_features,
    int *offsetx, int *offsety, int size_offset
);
void vx_glcm_haralick(
    int r,
    double *features,
    int size_cols_features,
    int size_offset,

    DMat2d_t** mat,
    DMat1d_t* sum,

    DMat1d_t* ene,
    DMat1d_t* ent,
    DMat1d_t* con,
    DMat1d_t* corr,
    DMat1d_t* hom,
    DMat1d_t* pobmax,

    DMat1d_t* mr,
    DMat1d_t* mc,
    DMat1d_t* o_r,
    DMat1d_t* o_c,
   
    DMat2d_t* sumr,
    DMat2d_t* sumc
);


//implements
void vx_glcm(
    ImageIO_t* img, double *features,
    int size_rows_features, int size_cols_features,
    int *offsetx, int *offsety, int size_offset
){  

    unsigned long i, j, r, c;
    int x, y, k, xj, yj, pi, pj, d, f, xui, xuj;
    double fc, w;
    
    memset(features, 0.0, (size_rows_features*size_cols_features)*sizeof(double));

    int _size = 256;
    int _n = size_offset;

    DMat1d_t* sum = vx_dmat1d_create(_n, 0.0);

    DMat1d_t* ene = vx_dmat1d_create(_n, 0.0);
    DMat1d_t* ent = vx_dmat1d_create(_n, 0.0);
    DMat1d_t* con = vx_dmat1d_create(_n, 0.0);
    DMat1d_t* corr = vx_dmat1d_create(_n, 0.0);
    DMat1d_t* hom = vx_dmat1d_create(_n, 0.0);
    DMat1d_t* pobmax = vx_dmat1d_create(_n, 0.0);

    DMat1d_t* mr = vx_dmat1d_create(_n, 0.0);
    DMat1d_t* mc = vx_dmat1d_create(_n, 0.0);
    DMat1d_t* o_r = vx_dmat1d_create(_n, 0.0);
    DMat1d_t* o_c = vx_dmat1d_create(_n, 0.0);
   
    DMat2d_t* sumr = vx_dmat2d_create(_n, _size, 0.0);
    DMat2d_t* sumc = vx_dmat2d_create(_n, _size, 0.0);


    DMat2d_t **mat = (DMat2d_t**)malloc(size_offset*sizeof(DMat2d_t*));
    for(i=0;i<size_offset;++i){
        mat[i] = vx_dmat2d_create(_size,_size, 0.0);
    }

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
                        //vx_dmat2d_set(mat[f], img->pixel[i], img->pixel[j])
                        vx_dmat2d_at(mat[f], img->pixel[i], img->pixel[j]) += 1.0;
                    }
                }
            }
            //next pixel in the region
            i = img->next[i];
            c += 1;
        }

        //compute haralick coefficients
        
        vx_glcm_haralick(
            r,
            features,
            size_cols_features,
            size_offset,

            mat,
            sum,

            ene,
            ent,
            con,
            corr,
            hom,
            pobmax,

            mr,
            mc,
            o_r,
            o_c,
        
            sumr,
            sumc);
        
    }

    //free memory
    for(i=0;i<size_offset;++i){
        vx_dmat2d_free(mat[i]);
    }
    free(mat);
    mat = NULL;


    vx_dmat1d_free(sum);

    vx_dmat1d_free(ene);
    vx_dmat1d_free(ent);
    vx_dmat1d_free(con);
    vx_dmat1d_free(corr);
    vx_dmat1d_free(hom);
    vx_dmat1d_free(pobmax);

    vx_dmat1d_free(mr);
    vx_dmat1d_free(mc);
    vx_dmat1d_free(o_r);
    vx_dmat1d_free(o_c);
   
    vx_dmat2d_free(sumr);
    vx_dmat2d_free(sumc);
}

void vx_glcm_haralick(
    int r,
    double *features,
    int size_cols_features,
    int size_offset,

    DMat2d_t** mat,
    DMat1d_t* sum,

    DMat1d_t* ene,
    DMat1d_t* ent,
    DMat1d_t* con,
    DMat1d_t* corr,
    DMat1d_t* hom,
    DMat1d_t* pobmax,

    DMat1d_t* mr,
    DMat1d_t* mc,
    DMat1d_t* o_r,
    DMat1d_t* o_c,
   
    DMat2d_t* sumr,
    DMat2d_t* sumc
){

    int i, j, k, x, y, vi, vj, i_j, xj, yj, gi, gj, ai, aj;
    double pij;
    int _size = 256;
    int _n = size_offset;
    
    //declarar medidas estadisticas de Haralick
    double val = 0.0;
    //normalice
    for(i=0;i<_size;++i){
        for(j=0;j<_size;++j){
            for(k=0;k<size_offset;++k){    
                val = vx_dmat2d_get(mat[k], i, j);
                val /= (0.000001+sum->data[k]);
                vx_dmat2d_set(mat[k], i, j, val);

                vx_dmat2d_set(sumr, k, i, val);
                vx_dmat2d_set(sumc, k, j, val);
            }
        }
    }


    for (i=0; i<_size; ++i){
        vi = i+1;
        for (k=0; k<_n; ++k){
            mr->data[k] += vi*vx_dmat2d_get(sumr, k, i);
            mc->data[k] += vi*vx_dmat2d_get(sumc, k, i);
        }
    }
        
  
    double i_ui2, j_uj2;
    for (i=0; i<_size; ++i){        
        vi = i+1;
        for (k=0; k<_n; ++k){
            i_ui2 = vi-mr->data[k];
            o_r->data[k] += (i_ui2*i_ui2)*vx_dmat2d_get(sumr, k, i);
                
            j_uj2 = vi-mc->data[k];
            o_c->data[k] += (j_uj2*j_uj2)*vx_dmat2d_get(sumc, k, i);
        }
    }
    for (k=0; k<_n; ++k){
        o_r->data[k] = sqrt(o_r->data[k]);
        o_c->data[k] = sqrt(o_c->data[k]);
    }
    

    ///calculate 6 measures of Haralick
    for (i=0; i<_size; ++i){
        for (j=0; j<_size; ++j){
            for (k=0; k<_n; ++k){
                vi = i+1;
                vj = j+1;

                pij = vx_dmat2d_get(mat[k], i, j);
                i_j = vi - vj;

                if (pij!=0.0){
                    ene->data[k] += pij*pij;
                    ent->data[k] += pij*(log(pij));
                    con->data[k] += (i_j*i_j)*pij;
                    hom->data[k] += pij/(1+abs(i_j));
                    //if (o_r->data[k]!=0.0 && o_c->data[k]!=0.0)
                    corr->data[k] += ((vi-mr->data[k])*(vj-mc->data[k])*pij)/(0.000001+(o_r->data[k]*o_c->data[k]));
                        
                    if (pij > pobmax->data[k])
                        pobmax->data[k] = pij;
                }            
            }
        }
    }

    for (k=0; k<_n; ++k){
        ent->data[k] *= (-1.0);
    }

    
    //juntar as medidas estadistircas no vetor
    for(i=0;i<_n;++i){
/*         j = (size_offset*i)+0;
        if (j>=size_cols_features)
            printf("saAAAAAAAAAAAAAAAAAA 1: %d %d %d %d \n", j, i, size_offset, size_cols_features);
        j = (size_offset*i)+1;
        if (j>=size_cols_features)
            printf("saAAAAAAAAAAAAAAAAAA 2: %d %d %d %d \n", j, i, size_offset, size_cols_features);
        j = (size_offset*i)+2;
        if (j>=size_cols_features)
            printf("saAAAAAAAAAAAAAAAAAA 3: %d %d %d %d \n", j, i, size_offset, size_cols_features);
        j = (size_offset*i)+3;
        if (j>=size_cols_features)
            printf("saAAAAAAAAAAAAAAAAAA 4: %d %d %d %d \n", j, i, size_offset, size_cols_features);
        j = (size_offset*i)+4;
        if (j>=size_cols_features)
            printf("saAAAAAAAAAAAAAAAAAA 5: %d %d %d %d \n", j, i, size_offset, size_cols_features);
 */
        features[(r*size_cols_features)+ ((6*i)+0)] =ene->data[i];
        features[(r*size_cols_features)+ ((6*i)+1)] =ent->data[i];
        features[(r*size_cols_features)+ ((6*i)+2)] =con->data[i];
        features[(r*size_cols_features)+ ((6*i)+3)] =corr->data[i];
        features[(r*size_cols_features)+ ((6*i)+4)] =hom->data[i];
        features[(r*size_cols_features)+ ((6*i)+5)] =pobmax->data[i];
    }
 
    for(k=0;k<size_offset;++k){
        vx_dmat2d_zero(mat[k]);
    }

    vx_dmat1d_zero(sum);

    vx_dmat1d_zero(ene);
    vx_dmat1d_zero(ent);
    vx_dmat1d_zero(con);
    vx_dmat1d_zero(corr);
    vx_dmat1d_zero(hom);
    vx_dmat1d_zero(pobmax);

    vx_dmat1d_zero(mr);
    vx_dmat1d_zero(mc);
    vx_dmat1d_zero(o_r);
    vx_dmat1d_zero(o_c);
   
    vx_dmat2d_zero(sumr);
    vx_dmat2d_zero(sumc);
}
#endif

