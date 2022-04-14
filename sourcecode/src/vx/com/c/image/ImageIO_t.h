/** 
*
* Athor: Ivar Vargas Belizario
* Copyright (C) 2021
*
 */

#ifndef IMAGEIOT_H
#define	IMAGEIOT_H

#include <string.h>
#include <stdbool.h> 

#include <assert.h>
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

// declare types and methods
typedef struct ImageIO_t ImageIO_t;
void vx_imageiot_free(ImageIO_t *&img);    
ImageIO_t* vx_imageiot_create(int width, int height, int channels, unsigned char *& fdata);
void vx_set_background_foreground(
    ImageIO_t *&img,
    unsigned char bg_pixel,
    unsigned long bg_label,
    unsigned long fg_label
);
void vx_make_regions(ImageIO_t *&img);

typedef struct ImageIO_t{
    int width, height, channels;
    unsigned long size_pixels, size_labels;

    unsigned char *pixel; 
    unsigned long *label;
    unsigned long *next;
    unsigned long *region;
    unsigned long *regionsize;

    unsigned long size_targets;
    unsigned long *target;
    char *name; 
    char **name_targets; 

}ImageIO_t;


void vx_imageiot_free(ImageIO_t *&img){
    //delete[] pixel;
    for(int i=0;i<256;++i){
        free(img->name_targets[i]);
    }

    free(img->name);
    img->name = NULL;

    free(img->name_targets);
    img->name_targets = NULL;

    free(img->target);
    img->target = NULL;

    free(img->label);
    img->label = NULL;

    free(img->next);
    img->next = NULL;
    
    free(img->region);
    img->region = NULL;

    free(img->regionsize);
    img->regionsize = NULL;

	free(img);
    img = NULL;
}


ImageIO_t* vx_imageiot_create(int width, int height, int channels, unsigned char *&fdata){
    //clock_t end, start = clock();

    ImageIO_t *img = (ImageIO_t*)malloc(sizeof(ImageIO_t));
    img->channels = channels;
    img->width = width;
    img->height = height;
    img->size_pixels = width*height;
    img->size_labels = 0;
    img->size_targets = 0;

    //img->pixel = (unsigned char*)malloc(img->size_pixels*img->channels*sizeof(unsigned char));
    img->label = (unsigned long*)malloc(img->size_pixels*sizeof(unsigned long));
    img->next = (unsigned long*)malloc(img->size_pixels*sizeof(unsigned long));
    img->region = (unsigned long*)malloc(img->size_pixels*sizeof(unsigned long));
    img->regionsize = (unsigned long*)malloc(img->size_pixels*sizeof(unsigned long));
    img->target = (unsigned long*)malloc(img->size_pixels*sizeof(unsigned long));
    img->pixel = fdata;
    img->name = (char*)malloc(256*sizeof(char));

    img->name_targets = (char**)malloc(256*sizeof(char*));
    for (int i = 0; i < 256; i++)
        img->name_targets[i] = (char*)malloc(20*sizeof(char));

    //end = clock();
    //printf("time creiate image: %f\n", (double)(end - start)/CLOCKS_PER_SEC);

    return img;
}

void vx_set_background_foreground(
    ImageIO_t *&img,
    unsigned char bg_pixel,
    unsigned long bg_label,
    unsigned long fg_label
){
    //clock_t end, start = clock();        
    unsigned long i, t;
    img->size_labels = 2;
        
    for (i=0; i<img->size_labels; ++i){
        img->regionsize[i] = 0;
    }
    for (i=0; i<img->size_pixels; ++i){
        img->label[i] = 0;
    }


    for (i=0; i<img->size_pixels; ++i){
        //background pixel
        if (img->pixel[i]==bg_pixel){
            img->label[i] = bg_label;
        }
        //other pixels foreground
        else{
            img->label[i] = fg_label;
        }
    }


    for (i=0; i<img->size_pixels; ++i){
        t = img->label[i];
        img->next[i] = img->region[t];
        img->region[t] = i;
        img->regionsize[t]++;
    }

    //end = clock();
    //std::cout<<"runtime update from...: "<<double(end - start)/ (CLOCKS_PER_SEC)<<std::endl;

}


void vx_make_regions(ImageIO_t *&img){
    clock_t end, start = clock();        
    unsigned long i, t;       
    for (i=0; i<img->size_labels; ++i){
        img->regionsize[i] = 0;
    }

    for (i=0; i<img->size_pixels; ++i){
        t = img->label[i];
        img->next[i] = img->region[t];
        img->region[t] = i;
        img->regionsize[t]++;
    }
    end = clock();
    //std::cout<<"runtime update from...: "<<double(end - start)/ (CLOCKS_PER_SEC)<<std::endl;
    printf("time make regions: %f\n", (double)(end - start)/CLOCKS_PER_SEC);
}


#endif