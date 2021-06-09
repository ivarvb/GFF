/*
# Author: Ivar Vargas Belizario
# Copyright (c) 2021
# E-mail: ivar@usp.br
*/

#ifndef DENSEMATRIXT_H
#define	DENSEMATRIXT_H

#include <string.h>
#include <stdbool.h> 
#include <stdio.h>
#include <math.h>
#include <float.h>

//declares
typedef struct DMat1d_t DMat1d_t;
typedef struct DMat2d_t DMat2d_t;

DMat1d_t* vx_dmat1d_create(int size, double value);
void vx_dmat1d_free(DMat1d_t *mat);
void vx_dmat1d_zero(DMat1d_t *mat);

DMat2d_t* vx_dmat2d_create(int rows, int cols, double value = 0.0);
void vx_dmat2d_free(DMat2d_t *mat);
void vx_dmat2d_set(int row, int col, double value);
double vx_dmat2d_get(DMat2d_t *mat, int row, int col);
double& vx_dmat2d_at(DMat2d_t *mat, int row, int col);
void vx_dmat2d_zero(DMat2d_t *mat);

//implements
typedef struct DMat1d_t{
    int size;
    double *data;
}DMat1d_t;

typedef struct DMat2d_t{
    int rows, cols;
    double *data; 
}DMat2d_t;

DMat1d_t* vx_dmat1d_create(int size, double value){
    DMat1d_t *mat = (DMat1d_t*)malloc(sizeof(DMat1d_t));
    mat->size = size;
    mat->data = (double*)malloc((size)*sizeof(double));
    memset(mat->data, value, (size)*sizeof(double));
    return mat;
}
void vx_dmat1d_free(DMat1d_t *mat){
    free(mat->data);
    mat->data = NULL;

    free(mat);
    mat=NULL;
}
void vx_dmat1d_zero(DMat1d_t *mat){
    memset(mat->data, 0.0, (mat->size)*sizeof(double));
}



DMat2d_t* vx_dmat2d_create(int rows, int cols, double value){
    DMat2d_t *mat = (DMat2d_t*)malloc(sizeof(DMat2d_t));
    mat->rows = rows;
    mat->cols = cols;
    mat->data = (double*)malloc((rows*cols)*sizeof(double));
    memset(mat->data, value, (rows*cols)*sizeof(double));
    return mat;
}
void vx_dmat2d_free(DMat2d_t *mat){
    free(mat->data);
    mat->data = NULL;
    
    free(mat);
    mat=NULL;
}
void vx_dmat2d_set(DMat2d_t *mat, int row, int col, double value){
    mat->data[row*mat->cols+col] = value;
}
double vx_dmat2d_get(DMat2d_t *mat, int row, int col){
    return mat->data[row*mat->cols+col];
}
double& vx_dmat2d_at(DMat2d_t *mat, int row, int col){
    return mat->data[row*mat->cols+col];
}
void vx_dmat2d_zero(DMat2d_t *mat){
    memset(mat->data, 0.0, (mat->rows*mat->cols)*sizeof(double));
}

#endif



