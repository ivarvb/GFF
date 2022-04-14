/*
# Author: Ivar Vargas Belizario
# Copyright (c) 2020
# All Rights Reserved
# E-mail: ivar@usp.br
*/

#ifndef DATAT_H
#define	DATAT_H

#include <string.h>
#include <stdbool.h> 
#include <stdio.h>
#include <math.h>
#include <float.h>

//#include "Vector_t.h"

//#include <assert.h>



const char *PROXNAME[]={"Euclidean","Manhattan","Camberra","Chebychev",
                        "Braycurtis","Cosine","Pearson","Gaussian","Correlation","DCosine" };
const int PROXINDEX[] = { 0, 1, 2, 3, 4, 5, 6, 7, 8, 9};
const int PROXCOEFF[] = { 1, 1, 1, 1, 1,-1,-1,-1,-1, 1};



typedef struct ProxMat_t ProxMat_t;
typedef struct DenseMat_t DenseMat_t;

typedef struct DenseMat_t{
    int rows;
    int cols;
    double *data;
} DenseMat_t;

typedef struct ProxMat_t{
    int rows;
    int cols;
    double d;
    int proxtype;
    double *data;
} ProxMat_t;

/*DECLARE FUNCTIONS AND METHODS*/
DenseMat_t* vx_densemat(int rows, int cols);
void vx_densemat_realloc(DenseMat_t* dat, int rows, int cols);

DenseMat_t* vx_densemat_from_csv(int indexuid, char filename[]);
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


//local
void vx_densemat_addnewrow(int indexuid, DenseMat_t *dat, char **words, int sizetokens);
void vx_densemat_addrow(DenseMat_t *dat);
int vx_densemat_maketokens(char *line, char *delim, char **words);




/*DECLARE FUNCTIONS AND METHODS MATRIX AND PROXIMITY*/
ProxMat_t* vx_proxmat(int n, double init, int isinit);
void vx_proxmat_free(ProxMat_t* dat);
double vx_proxmat_get(ProxMat_t* mat, int i, int j);
void vx_proxmat_set(ProxMat_t* mat, int i, int j, double v);
ProxMat_t* vx_proxmat_from_densemat_rows(DenseMat_t* dat, int pt);
ProxMat_t* vx_proxmat_from_densemat_cols(DenseMat_t* dat, int pt);
double vx_proximity_rows(DenseMat_t* dat, int i, int j, int pt);
double vx_proximity_cols(DenseMat_t* dat, int i, int j, int pt);

double vx_proximity_two_densemat_rows(DenseMat_t* dati, DenseMat_t* datj, int i, int j, int pt);

//
///*IMPLEMENTS FUNCTIONS AND METHODS*/
//Data_t* make_data_t(int cols){
DenseMat_t* vx_densemat(int rows, int cols){
    DenseMat_t* dat = (DenseMat_t*)malloc(sizeof(DenseMat_t));
    dat->rows = rows;
    dat->cols = cols;
    dat->data = (double*)calloc((dat->rows*dat->cols), sizeof(double));
    return dat;
}

void vx_densemat_realloc(DenseMat_t* dat, int rows, int cols){
    dat->rows = rows;
    dat->cols = cols;
    dat->data = (double*)realloc(dat->data, ((dat->rows)*dat->cols)*sizeof(double));
}

void vx_densemat_free(DenseMat_t* dat) {
    free(dat->data);
    free(dat);
    dat = NULL;
}
void vx_densemat_set(DenseMat_t *dat, int row, int col, double v){
    dat->data[row*dat->cols+col] = v;
}
double vx_densemat_get(DenseMat_t *dat, int row, int col){
    return dat->data[row*dat->cols+col];
}
void vx_densemat_addnewrow(int indexuid, DenseMat_t *dat, char **words, int cols){
    //    assert(dat->cols == sizetokens);
    dat->cols = cols-indexuid;
    dat->rows++;
    dat->data = (double*)realloc(dat->data, ((dat->rows)*dat->cols)*sizeof(double));
    int j;
    for (j=0; j<dat->cols; ++j){
        dat->data[(dat->rows-1)*dat->cols+j] = atof(words[j+indexuid]);
    }
}
void vx_densemat_addrow(DenseMat_t *dat){
    dat->rows++;
    dat->data = (double*)realloc(dat->data, ((dat->rows)*dat->cols)*sizeof(double));
}    
int vx_densemat_maketokens(char *line, char *delim, char **words){
    char *token = strtok(line, delim);
    int i = 0;
    while (token != NULL) {
        words[i] = token;
        token = strtok(NULL,delim);
        i++;
    }
    return i;
}
DenseMat_t* vx_densemat_from_csv(int indexuid, char filename[]){
    FILE * fp;
    char * line = NULL;
    size_t len = 0;
    ssize_t read;

    char *words[100000];
    char *delim = ",";
    int sizetokens = 0;
    fp = fopen(filename, "r");
    if (fp == NULL)
        exit(EXIT_FAILURE);

    read = getline(&line, &len, fp);        
    int cols = vx_densemat_maketokens(line, delim, words);
    DenseMat_t* dat = vx_densemat(0,0);
    //printf("make_data_from_csv_file_t %d %d  x\n", indexuid, cols);
    while ((read = getline(&line, &len, fp)) != -1) {
        sizetokens = vx_densemat_maketokens(line, delim, words);
        vx_densemat_addnewrow(indexuid, dat, words, cols);
    }

    cols = sizetokens;
    fclose(fp);
    if (line)
        free(line);
    
    return dat;
}
DenseMat_t* vx_densemat_transform(DenseMat_t* dat, int bins, int transpose){
    int ncolsf, ncols, r, c, nc, n, c1;
    double mean, std, s;
    DenseMat_t* ndat = vx_densemat(0,0);
    //to the same matrix
    if (transpose==0){
        ncolsf = (int)(-1*floor(-(dat->cols/(double)bins)));
        ncols = ncolsf*2;
        ndat->cols = ncols;
        for (r=0;r<dat->rows;++r){
            ndat->rows++;
            ndat->data = (double*)realloc(ndat->data, ((ndat->rows)*ndat->cols)*sizeof(double));
            nc=0;
            for (c=0;c<dat->cols;c=c+bins){
                n = 0;
                mean = 0.0;
                for (c1=c;c1<c+bins && c1<dat->cols;++c1){
                    mean += vx_densemat_get(dat, r, c1);
                    n++;
                }
                mean /= n;
                
                std = 0.0;
                for (c1=c;c1<c+bins && c1<dat->cols;++c1){
                    s = vx_densemat_get(dat, r, c1) - mean;
                    std += s*s;
                }
                std = sqrt(std/(n));
                vx_densemat_set(ndat, r, nc, mean);
                vx_densemat_set(ndat, r, nc+ncolsf, std);
                nc++;
            }
        }
    }
    //to the same transpose matrix
    else{
//        ncolsf = (int)(-1*floor(-((dat->rows/bins)+0.5)));
        ncolsf = (int)(-1*floor(-(dat->rows/(double)bins)));
//        ncolsf = (int)( (dat->rows/bins)+0.5 );
        ncols = ncolsf*2;
        ndat->cols = ncols;
        for (r=0;r<dat->cols;++r){
            ndat->rows++;
            ndat->data = (double*)realloc(ndat->data, ((ndat->rows)*ndat->cols)*sizeof(double));
            nc=0;
            for (c=0;c<dat->rows;c=c+bins){
                n = 0;
                mean = 0.0;
                for (c1=c;c1<c+bins && c1<dat->rows;++c1){
//                    mean += get_t(dat, r, c1);
                    mean += vx_densemat_get(dat, c1, r);
                    n++;
                }
                mean /= n;
                
                std = 0.0;
                for (c1=c;c1<c+bins && c1<dat->rows;++c1){
//                    s = get_t(dat, r, c1) - mean;
                    s = vx_densemat_get(dat, c1, r) - mean;
                    std += s*s;
                }
                //printf(" (%d %d)",nc, c);
                std = sqrt(std/(n));
                vx_densemat_set(ndat, r, nc, mean);
                vx_densemat_set(ndat, r, nc+ncolsf, std);
//                set_t(ndat, r, nc+ncolsf, 10001.101);
                nc++;
            }
        }    
    }
//    printf(" \n xxx %d \n)", ncolsf);
    return ndat;
}
DenseMat_t* vx_densemat_transpose(DenseMat_t* dat){
    int r, c;
    DenseMat_t* ndat = vx_densemat(0,0);
    ndat->cols = dat->rows;
    for (c=0;c<dat->cols;++c){
        ndat->rows++;
        ndat->data = (double*)realloc(ndat->data, ((ndat->rows)*ndat->cols)*sizeof(double));
        for (r=0;r<dat->rows;++r){
            vx_densemat_set(ndat, c, r, vx_densemat_get(dat, r, c));
        }
    }
    return ndat;
}

void vx_densemat_normalization_row(DenseMat_t* dat, int r, int pt){
    double a;
    double min =  10000000000000000.0;
    double max = -10000000000000000.0;
    double maxmin = 0.0;

    double mean = 0.0;
    double sigma = 0.0;
    double eps = 1e-6;
    int i;
    //Min-Max
    if (pt==0){
        for(i=0;i<dat->cols;++i){
            a = vx_densemat_get(dat, r, i);
            if (a<min)
                min = a;
            if (a>max)
                max = a;
        }
        maxmin = max-min;
        for(i=0;i<dat->cols;++i){
            a = (vx_densemat_get(dat, r, i)-min)/maxmin;
            vx_densemat_set(dat, r, i, a);
        }
    }
    //Z-Score
    else if(pt==1){
        for(i=0; i<dat->cols; ++i)
            mean += vx_densemat_get(dat, r, i);
        
        mean = mean/dat->cols;
        
        for(i=0; i<dat->cols; ++i){
            a = vx_densemat_get(dat, r, i) - mean;
            sigma += a*a;
        }
        
        sigma = sqrt( sigma/(dat->cols-1) );

        if (sigma < eps){
            sigma = 1.0;
        }
        for(i=0; i<dat->cols; ++i){
            a = (vx_densemat_get(dat, r, i) - mean)/(sigma);
            vx_densemat_set(dat, i, r, i);
        }
    }
}

void vx_densemat_normalization_col(DenseMat_t* dat, int c, int pt){
    double a;
    double min =  10000000000000000.0;
    double max = -10000000000000000.0;
    double maxmin = 0.0;

    double mean = 0.0;
    double sigma = 0.0;
    double eps = 1e-6;
    int i;
    //Min-Max
    if (pt==0){
        for(i=0;i<dat->rows;++i){
            a = vx_densemat_get(dat, i, c);
            if (a<min)
                min = a;
            if (a>max)
                max = a;
        }
        maxmin = max-min;
        for(i=0;i<dat->rows;++i){
            a = (vx_densemat_get(dat, i, c)-min)/maxmin;
            vx_densemat_set(dat, i, c, a);
        }
    }
    //Z-Score
    else if(pt==1){
        for(i=0; i<dat->rows; ++i)
            mean += vx_densemat_get(dat, i, c);
        
        mean = mean/dat->rows;
        
        for(i=0; i<dat->rows; ++i){
            a = vx_densemat_get(dat, i, c) - mean;
            sigma += a*a;
        }
        
        sigma = sqrt( sigma/(dat->rows-1) );

        if (sigma < eps){
            sigma = 1.0;
        }
        for(i=0; i<dat->rows; ++i){
            a = (vx_densemat_get(dat, i, c) - mean)/(sigma);
            vx_densemat_set(dat, i, c, a);
        }
    }
}


DenseMat_t* vx_densemat_select_cols(DenseMat_t* dat_in, int* colsids, int sizecols){
    int r, i;
    DenseMat_t* dat_ou = vx_densemat(0,0);
    dat_ou->cols = sizecols;
    dat_ou->rows = 0;

    for (r=0; r<dat_in->rows; ++r){
        dat_ou->rows++;
        dat_ou->data = (double*)realloc(dat_ou->data, (dat_ou->rows*dat_ou->cols)*sizeof(double));
        for (i=0; i<sizecols; ++i){
            vx_densemat_set(dat_ou, r, i, vx_densemat_get(dat_in, r, colsids[i]));
        }
    }
    return dat_ou;
}

DenseMat_t* vx_densemat_select_rows(DenseMat_t* dat_in, int* rowsids, int sizerows){
    int r, c;
    DenseMat_t* dat_ou = vx_densemat(0,0);
    dat_ou->cols = dat_in->cols;
    dat_ou->rows = sizerows;
    dat_ou->data = (double*)realloc(dat_ou->data, (dat_ou->rows*dat_ou->cols)*sizeof(double));

    for (r=0; r<sizerows; ++r){
        for (c=0; c<dat_in->cols; ++c){
            vx_densemat_set(dat_ou, r, c, vx_densemat_get(dat_in, rowsids[r], c));
        }
    }
    return dat_ou;
}

void vx_densemat_fill_row(DenseMat_t* dat, int r, double fill){
    int c;
    for (c=0;c<dat->cols;++c){
        vx_densemat_set(dat, r, c, fill);
    }
}
void vx_densemat_fill_col(DenseMat_t* dat, int c, double fill){
    int r;
    for (r=0;r<dat->rows;++r){
        vx_densemat_set(dat, r, c, fill);
    }
}
void vx_densemat_copy_row(DenseMat_t* dati, int rowi, DenseMat_t* datj, int rowj){
    int c;
    for (c=0;c<dati->cols;++c){
        vx_densemat_set(dati, rowi, c, vx_densemat_get(datj, rowj, c));
    }
}




/**************************************************************/
/////////////////////////////////////////////////////////
////////////////// PROXIMITY MATRIX
/////////////////////////////////////////////////////////
/**************************************************************/
ProxMat_t* vx_proxmat(int n, double init, int isinit){
    ProxMat_t* pm = (ProxMat_t*)malloc(sizeof(ProxMat_t));
    pm->rows = n;
    pm->cols = n;
    int _n = (int)((n-1)*(n)/2.0);
    pm->data = (double*)calloc( _n, sizeof(double) );
    int i;
    if (isinit>0){
        for(i=0;i<_n;++i){
            pm->data[i] = init;
        }
    }
    return pm;    
}
void vx_proxmat_free(ProxMat_t* pm){
    free(pm->data);
    free(pm);
    pm = NULL;
}
double vx_proxmat_get(ProxMat_t* mat, int row, int col){
    int aux;
    if (col>row){
        aux = row;
        row = col;
        col = aux;
    }
    return mat->data[ (int)((row*(row+1)/2) - (row-col)) ];
    //return mat->data[row*mat->cols+col];
}
void vx_proxmat_set(ProxMat_t* mat, int row, int col, double v){
    int aux;
    if (col>row){
        aux = row;
        row = col;
        col = aux;
    }
    mat->data[ (int)((row*(row+1)/2) - (row-col)) ] = v;
    //mat->data[row*mat->cols+col] = v;
}

ProxMat_t* vx_proxmat_from_densemat_rows(DenseMat_t* dat, int pt){
    double minv = DBL_MAX;
    double maxv = DBL_MIN;
    int i, j, n;
    double d;
    n = dat->rows;
    ProxMat_t* pm = vx_proxmat(n, 0.0, 0);
    for (i=0;i<n;++i){
        for (j=i+1;j<n;++j){
            d = (vx_proximity_rows(dat, i, j, pt));
            if (d<minv)
                minv = d;
            if (d>maxv)
                maxv = d;
//            printf(" %f",d);
            vx_proxmat_set(pm, i, j, d);
            //pm->data[i*n+j] = d;
            //pm->data[j*n+i] = d;
        }
    }
    for (i=0;i<n;++i){
        for (j=i+1;j<n;++j){
            d = (vx_proxmat_get(pm, i, j)-minv)/(0.0000001+(maxv-minv));
            if (PROXCOEFF[pt]==-1){d = 1.0 - d;}
            vx_proxmat_set(pm, i, j, d);
            //pm->data[i*n+j] = d;
            //pm->data[j*n+i] = d;
        }
    }
    return pm;
//    return 0;
}

ProxMat_t* vx_proxmat_from_densemat_cols(DenseMat_t* dat, int pt){
    double minv = DBL_MAX;
    double maxv = DBL_MIN;
    int i, j, n;
    double d;
    n = dat->cols;
    ProxMat_t* pm = vx_proxmat(n,0.0,0);
    for (i=0;i<n;++i){
        for (j=i+1;j<n;++j){
            d = (vx_proximity_cols(dat, i, j, pt));

            if (d<minv)
                minv = d;
            if (d>maxv)
                maxv = d;
//            printf(" %f",d);
            vx_proxmat_set(pm, i, j, d);
            //pm->data[i*n+j] = d;
            //pm->data[j*n+i] = d;
        }
    }
    double aux = maxv-minv;
    //printf("begin normal %f \n",aux);
    for (i=0;i<n;++i){
        for (j=i+1;j<n;++j){
            d = (vx_proxmat_get(pm, i, j)-minv)/(0.0000001+(aux));
            if (PROXCOEFF[pt]==-1){d = 1.0 - d;}
            //d = roundf(d*1000000)/1000000;
            vx_proxmat_set(pm, i, j, d);
            //pm->data[i*n+j] = d;
            //pm->data[j*n+i] = d;
        }
    }
    //printf("end normal %f \n",aux);
    return pm;
}

double vx_proximity_rows(DenseMat_t* dat, int i, int j, int pt){
    int s;
    double a, b, c, p, xi, xj, im, jm, xmi, xmj, n;
    p = 0.0;
    n = dat->cols;
    //Euclidean
    if (pt==0){
        for(s=0;s<dat->cols;++s){
            a = vx_densemat_get(dat, i, s)-vx_densemat_get(dat, j, s);
            p += a*a;
        }
        p = sqrt(p);
    }
    //Manhattan
    else if(pt==1){
        for(s=0;s<dat->cols;++s){
            p += fabs(vx_densemat_get(dat, i, s)-vx_densemat_get(dat, j, s));
        }
        //printf("manhattan row: %f", p);
    }
    //Camberra
    else if(pt==2){
        for(s=0;s<dat->cols;++s){
            xi = vx_densemat_get(dat, i, s);
            xj = vx_densemat_get(dat, j, s);
            a = fabs(xi-xj);
            b = fabs(xi)+fabs(xj);
            p += a/((0.0000001)+b);
        }
    }
    //Chebychev
    else if(pt==3){
        b = -1.0;
        for(s=0;s<dat->cols;++s){
            a = fabs(vx_densemat_get(dat, i, s)-vx_densemat_get(dat, j, s));
            if (a>b) b = a;
        }
        p = b;
        //printf("Chebychev row: %f", p);
    }
    //Bray Curtis
    else if(pt==4){
        a = 0.0; b = 0.0;
        for(s=0;s<dat->cols;++s){
            xi = vx_densemat_get(dat, i, s);
            xj = vx_densemat_get(dat, j, s);
            a += fabs(xi-xj);
            b += xi+xj;
        }
        p = a/b;
    }
    //Cosine correlation
    else if(pt==5){
        a = 0.0; b = 0.0; c = 0.0;
        for(s=0;s<dat->cols;++s){
            xi = vx_densemat_get(dat, i, s);
            xj = vx_densemat_get(dat, j, s);
            a += xi*xj; 
            b += xi*xi; 
            c += xj*xj; 
        }
        //p = (1+a/(0.0000001+sqrt(b*c)))/2.0;
        p = a/(0.0000001+(sqrt(b)*sqrt(c)));
    }
    //Pearson correlation
    else if(pt==6){
        a = 0.0; b = 0.0; c = 0.0; im=0.0; jm=0.0;
        for(s=0;s<dat->cols;++s){
            im += vx_densemat_get(dat, i, s);
            jm += vx_densemat_get(dat, j, s);
        }
        im /= dat->cols;
        jm /= dat->cols;

        // im /= dat->rows;
        // jm /= dat->rows;
        for(s=0;s<dat->cols;++s){
            xi = vx_densemat_get(dat, i, s);
            xj = vx_densemat_get(dat, j, s);
            xmi = (xi-im);
            xmj = (xj-jm);
            a += xmi*xmj; 
            b += xmi*xmi; 
            c += xmj*xmj;
        }
        p = a/(0.0000001+sqrt(b*c)); 
        //p = ( 1+p )/2.0;
    }
    //Gaussian
    else if(pt==7){
        p = 0.0;
        for(s=0;s<dat->cols;++s){
            a = vx_densemat_get(dat, i, s)-vx_densemat_get(dat, j, s);
            p += a*a;
        }
        p = sqrt(p);
//        p = exp( -1.0*(p*p) / ( 2.0*(20.0095*20.0095) ) );
        p = exp( -1.0*(p*p) / ( 2.0*(0.5*0.5) ) );
    }
    //Correlation
    else if(pt==8){
        double ai = 0.0;
        double x2 = 0.0;
        double y2 = 0.0;
        double ax = 0.0;
        double ay = 0.0;
        for(s=0;s<n;++s){
            xi = vx_densemat_get(dat, i, s);
            xj = vx_densemat_get(dat, j, s);
            ax += xi; 
            ay += xj; 
            ai += xi*xj; 
            x2 += xi*xi; 
            y2 += xj*xj;
        }
        p = ( (ai*n) - (ax*ay) ) /(0.0000001+sqrt( ( (n*x2)-(ax*ax) )* ( (n*y2)-(ay*ay) )  ) );
        //p = (1.0+p)/2.0;
    }
    return p;
}

double vx_proximity_cols(DenseMat_t* dat, int i, int j, int pt){
    int s;
    double a, b, c, p, xi, xj, im, jm, xmi, xmj, n;
    p = 0.0;
    n = dat->rows;
    //Euclidean
    if (pt==0){
        for(s=0;s<dat->rows;++s){
            a = vx_densemat_get(dat, s, i)-vx_densemat_get(dat, s, j);
            p += a*a;
        }
        p = sqrt(p);
    }
    //Manhattan
    else if(pt==1){
        for(s=0;s<dat->rows;++s){
            p += fabs(vx_densemat_get(dat, s, i)-vx_densemat_get(dat, s, j));
        }
    }
    //Camberra
    else if(pt==2){
        for(s=0;s<dat->rows;++s){
            xi = vx_densemat_get(dat, s, i);
            xj = vx_densemat_get(dat, s, j);
            a = fabs(xi-xj);
            b = fabs(xi)+fabs(xj);
            p += a/((0.0000001)+b);
        }
    }
    //Chebychev
    else if(pt==3){
        b = -1.0;
        for(s=0;s<dat->rows;++s){
            a = fabs(vx_densemat_get(dat, s, i)-vx_densemat_get(dat, s, j));
            if (a>b) b = a;
            //printf("Chebychev col i j : %f %f", get_t(dat, s, i), get_t(dat, s, j), a);
        }
        p = b;
        //printf("Chebychev col: %f", p);
    }
    //Bray Curtis
    else if(pt==4){
        a = 0.0; b = 0.0;
        for(s=0;s<dat->rows;++s){
            xi = vx_densemat_get(dat, s, i);
            xj = vx_densemat_get(dat, s, j);
            a += fabs(xi-xj);
            b += xi+xj;
        }
        p = a/b;
    }
    //Cosine correlation
    else if(pt==5){
        a = 0.0; b = 0.0; c = 0.0;
        for(s=0;s<dat->rows;++s){
            xi = vx_densemat_get(dat, s, i);
            xj = vx_densemat_get(dat, s, j);
            a += xi*xj; 
            b += xi*xi; 
            c += xj*xj; 
        }
        //p = (1+a/(0.0000001+sqrt(b*c)))/2.0;
        p = a/(0.00000001+(sqrt(b)*sqrt(c)));
    }
    //Pearson correlation
    else if(pt==6){
        a = 0.0; b = 0.0; c = 0.0; im=0.0; jm=0.0;
        for(s=0;s<dat->rows;++s){
            im += vx_densemat_get(dat, s, i);
            jm += vx_densemat_get(dat, s, j);
        }
        im /= dat->rows;
        jm /= dat->rows;
        for(s=0;s<dat->rows;++s){
            xi = vx_densemat_get(dat, s, i);
            xj = vx_densemat_get(dat, s, j);
            xmi = (xi-im);
            xmj = (xj-jm);
            a += xmi*xmj; 
            b += xmi*xmi; 
            c += xmj*xmj;
        }
        p = a/(0.0000001+sqrt(b*c));
        //p = ( 1+(p) )/2.0;
    }
    //Gaussian
    else if(pt==7){
        p = 0.0;
        for(s=0;s<dat->rows;++s){
            a = vx_densemat_get(dat, s, i)-vx_densemat_get(dat, s, j);
            p += a*a;
        }
        p = sqrt(p);
//        p = exp( -1.0*(p*p) / ( 2.0*(20.0095*20.0095) ) );
        p = exp( (-1.0*(p*p) )/ ( 2.0*(0.5*0.5) ) );
    }
    //correlation
    else if(pt==8){
        double ai = 0.0;
        double x2 = 0.0;
        double y2 = 0.0;
        double ax = 0.0;
        double ay = 0.0;
        for(s=0;s<n;++s){
            xi = vx_densemat_get(dat, s, i);
            xj = vx_densemat_get(dat, s, j);
            ax += xi; 
            ay += xj; 
            ai += xi*xj; 
            x2 += xi*xi; 
            y2 += xj*xj;
        }

        p = ( (ai*n) - (ax*ay) ) / (0.0001+sqrt( (n*x2)-(ax*ax) )*sqrt( (n*y2)-(ay*ay) ) );
        //p = (1.0+p)/2.0;        
        //printf("coreeeeeeee: %f", p);
    }
    //correlation
    // else if(pt==8){
    //     double ai = 0.0;
    //     double x2 = 0.0;
    //     double y2 = 0.0;
    //     double ax = 0.0;
    //     double ay = 0.0;
    //     for(s=0;s<n;++s){
    //         xi = get_t(dat, s, i);
    //         xj = get_t(dat, s, j);
    //         ai = xi-xj; 
    //         x2 += ai*ai; 
    //     }

    //     p = (6*x2)/(n*(n*n-1));
    //     p = (1.0-p)/2.0;
    // }
    return p;
}

double vx_proximity_two_densemat_rows(DenseMat_t* dati, DenseMat_t* datj, int i, int j, int pt){
    int s;
    double a, b, c, p, xi, xj, im, jm, xmi, xmj, n;
    p = 0.0;
    n = dati->cols;
    //Euclidean
    if (pt==0){
        for(s=0;s<dati->cols;++s){
            a = vx_densemat_get(dati, i, s)-vx_densemat_get(datj, j, s);
            p += a*a;
        }
        p = sqrt(p);
    }
    //Manhattan
    else if(pt==1){
        for(s=0;s<dati->cols;++s){
            p += fabs(vx_densemat_get(dati, i, s)-vx_densemat_get(datj, j, s));
        }
        //printf("manhattan row: %f", p);
    }
    //Camberra
    else if(pt==2){
        for(s=0;s<dati->cols;++s){
            xi = vx_densemat_get(dati, i, s);
            xj = vx_densemat_get(datj, j, s);
            a = fabs(xi-xj);
            b = fabs(xi)+fabs(xj);
            p += a/((0.0000001)+b);
        }
    }
    //Chebychev
    else if(pt==3){
        b = -1.0;
        for(s=0;s<dati->cols;++s){
            a = fabs(vx_densemat_get(dati, i, s)-vx_densemat_get(datj, j, s));
            if (a>b) b = a;
        }
        p = b;
        //printf("Chebychev row: %f", p);
    }
    //Bray Curtis
    else if(pt==4){
        a = 0.0; b = 0.0;
        for(s=0;s<dati->cols;++s){
            xi = vx_densemat_get(dati, i, s);
            xj = vx_densemat_get(datj, j, s);
            a += fabs(xi-xj);
            b += xi+xj;
        }
        p = a/b;
    }
    //Cosine correlation
    else if(pt==5){
        a = 0.0; b = 0.0; c = 0.0;
        for(s=0;s<dati->cols;++s){
            xi = vx_densemat_get(dati, i, s);
            xj = vx_densemat_get(datj, j, s);
            a += xi*xj; 
            b += xi*xi; 
            c += xj*xj; 
        }
        p = (1+a/(0.0000001+sqrt(b*c)))/2.0;
//        p = a/(sqrt(b)*sqrt(c));
    }
    //Pearson correlation
    else if(pt==6){
        a = 0.0; b = 0.0; c = 0.0; im=0.0; jm=0.0;
        for(s=0;s<dati->cols;++s){
            im += vx_densemat_get(dati, i, s);
            jm += vx_densemat_get(datj, j, s);
        }
        im /= dati->cols;
        jm /= dati->cols;

        // im /= dat->rows;
        // jm /= dat->rows;
        for(s=0;s<dati->cols;++s){
            xi = vx_densemat_get(dati, i, s);
            xj = vx_densemat_get(datj, j, s);
            xmi = (xi-im);
            xmj = (xj-jm);
            a += xmi*xmj; 
            b += xmi*xmi; 
            c += xmj*xmj;
        }
        p = a/(0.0000001+sqrt(b*c)); 
        //p = ( 1+p )/2.0;
    }
    //Gaussian
    else if(pt==7){
        p = 0.0;
        for(s=0;s<dati->cols;++s){
            a = vx_densemat_get(dati, i, s)-vx_densemat_get(datj, j, s);
            p += a*a;
        }
        p = sqrt(p);
//        p = exp( -1.0*(p*p) / ( 2.0*(20.0095*20.0095) ) );
        p = exp( -1.0*(p*p) / ( 2.0*(0.5*0.5) ) );
    }
    //Correlation
    else if(pt==8){
        double ai = 0.0;
        double x2 = 0.0;
        double y2 = 0.0;
        double ax = 0.0;
        double ay = 0.0;
        for(s=0;s<dati->cols;++s){
            xi = vx_densemat_get(dati, i, s);
            xj = vx_densemat_get(datj, j, s);
            ax += xi; 
            ay += xj; 
            ai += xi*xj; 
            x2 += xi*xi; 
            y2 += xj*xj;
        }
        p = ( (ai*n) - (ax*ay) ) /(0.0000001+sqrt( ( (n*x2)-(ax*ax) )* ( (n*y2)-(ay*ay) )  ) );
        //p = (1.0+p)/2.0;
    }
    //Cosine correlation
    else if(pt==9){
        a = 0.0; b = 0.0; c = 0.0;
        for(s=0;s<dati->cols;++s){
            xi = vx_densemat_get(dati, i, s);
            xj = vx_densemat_get(datj, j, s);
            a += xi*xj; 
            b += xi*xi; 
            c += xj*xj; 
        }
        p = 1.0-(1+a/(0.0000001+sqrt(b*c)))/2.0;

    }
    return p;
}



#endif

