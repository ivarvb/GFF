/** 
*
* Athor: Ivar Vargas Belizario
* Copyright (C) 2021
*
 */

#ifndef IMAGET_H
#define	IMAGET_H

#include <string.h>
#include <stdbool.h> 

#include <assert.h>
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

#include "Color3RGB.h"

const int x8[8] = {-1,  0, 1, 0, -1,  1, 1, -1};//for 4 or 8 connectivity
const int y8[8] = { 0, -1, 0, 1, -1, -1, 1,  1};//for 4 or 8 connectivity

// declare types and methods
/* typedef struct Pixel_t Pixel_t;
typedef struct Region_t Region_t; */
typedef struct Image_t Image_t;

void vx_image_free(Image_t *&img);    
Image_t* vx_image_create(int width, int height, int fdatai, unsigned char *& fdata);
void vx_image_seg_read(
    char filename[],
    int width, int height, unsigned long &size_labels, unsigned long *&label,
    unsigned long *&next, unsigned long *&region, unsigned long *&regionsize,
    unsigned long *&target, char**& name_targets, unsigned long *size_targets
);
void vx_image_seg_write(
    char filename[], char name[], int width, int height,
    unsigned long *&label, unsigned long size_labels,
    unsigned long *&target,  char**& name_targets, unsigned long *size_targets);
void vx_image_seg_width_height(char filename[], int &width, int &height);

void vx_image_fillcolor(Image_t *&img, Color3RGB color);
void vx_image_setcolor(Image_t *&img, int i, Color3RGB color);
Color3RGB vx_image_getcolor(Image_t *&img, int i);

void vx_image_fillgray(Image_t *&img, unsigned char gray);
void vx_image_setgray(Image_t *&img, int i, unsigned char gray);
unsigned char vx_image_getgray(Image_t *&img, int i);

void vx_image_draw_regions_limits(unsigned char *&pixel, unsigned long size_pixels, unsigned long *&label, int width, int height);
void vx_image_draw_regions(unsigned char *&pixel, unsigned long size_pixels, unsigned long *&label, unsigned long size_labels);
void vx_image_update_regions(Image_t *&image);
void vx_image_gray_update_b_in_a(
    Image_t *&img_a, unsigned char a, unsigned long la,
    Image_t *&img_b, unsigned char b, unsigned long lb
);


void vx_copy(void *destination, void *source, size_t n);
void vx_maketokens(char *line, const char *delim, char **words, int sizetokens);



// types
/* typedef struct Pixel_t{
    int i;
    int x;
    int y;
    int label;
    Pixel_t *next;
}Pixel_t; */

/* typedef struct Region_t{
    Pixel_t *next;
    int size;
}Region_t; */

typedef struct Image_t{
    int width, height, channels;
    unsigned long size_pixels, size_labels;
    /* Pixel_t *pixel; */
    unsigned char *pixel;
    unsigned long *label;
    unsigned long *next;
    unsigned long *region;
    unsigned long *regionsize;
/* 
    unsigned long *x;
    unsigned long *y;
 */
    //Region_t *region;

}Image_t;


void vx_image_free(Image_t *&img){
    /* if (img->pixel!=NULL){
	    free(img->pixel);
    } */
    //free(img->pixel);
	free(img->label);
    img->label = NULL;

	free(img->next);
    img->next = NULL;

	free(img->region);
    img->region = NULL;

	free(img->regionsize);
    img->regionsize = NULL;

/* 	free(img->x);
    img->x = NULL;

	free(img->y);
    img->y = NULL; */

	free(img);
    img = NULL;
}


Image_t* vx_image_create(int width, int height, int fdatai, unsigned char *&fdata){
//Image_t* vx_image_create(int w, int h, int intensity){
    clock_t end, start = clock();

    Image_t *img = (Image_t*)malloc(sizeof(Image_t));
    img->channels = fdatai;
    img->width = width;
    img->height = height;
    img->size_pixels = width*height;


    clock_t xstart = clock();
    clock_t xend;
    //img->pixel = (unsigned char*)malloc(img->size_pixels*img->channels*sizeof(unsigned char));
    img->label = (unsigned long*)malloc(img->size_pixels*img->channels*sizeof(unsigned long));
    img->next = (unsigned long*)malloc(img->size_pixels*img->channels*sizeof(unsigned long));
    img->region = (unsigned long*)malloc(img->size_pixels*img->channels*sizeof(unsigned long));
    img->regionsize = (unsigned long*)malloc(img->size_pixels*img->channels*sizeof(unsigned long));
/* 
    img->x = (unsigned long*)malloc(img->size_pixels*img->channels*sizeof(unsigned long));
    img->y = (unsigned long*)malloc(img->size_pixels*img->channels*sizeof(unsigned long));
 */  

/*     img->pixel = (Pixel_t*)malloc(img->size_pixels*sizeof(Pixel_t));
    img->region = (Region_t*)malloc(img->size_pixels*sizeof(Region_t)); */

    xend = clock();
    printf(" malloc: %f\n", (double)(xend - xstart)/CLOCKS_PER_SEC);

    // initializing attributes
    int x, y;
    unsigned long i;
    //unsigned long z = img->size_pixels;
    img->pixel = fdata;
    for (y=0;y<img->height;++y){
        for (x=0;x<img->width;++x){
            i=y*img->width+x;
/*          for (j=0;j<img->channels;++j){
            img->pixel[j*z+i] = fdata[j*z+i];
                } */
/* 
            img->x[i] = x;
            img->y[i] = y;
 */                
            img->next[i] = img->region[0];
            img->region[0] = i;

            img->label[i] = 0;

        }
    }
    img->size_labels = 1;
    img->regionsize[0] = img->size_pixels;

    end = clock();
    printf("time creiate image: %f\n", (double)(end - start)/CLOCKS_PER_SEC);
    
    return img;
}


void vx_image_fillcolor(Image_t *&img, Color3RGB color){
    unsigned long i;
    for (i=0; i<img->size_pixels; ++i){
        vx_image_setcolor(img, i, color);
    }
}
void vx_image_setcolor(Image_t *&img, int i, Color3RGB color){
    img->pixel[0*img->size_pixels+i] = color.R;
    img->pixel[1*img->size_pixels+i] = color.G;
    img->pixel[2*img->size_pixels+i] = color.B;
}
Color3RGB vx_image_getcolor(Image_t *&img, int i){
    Color3RGB color;
    color.R = img->pixel[0*img->size_pixels+i];
    color.G = img->pixel[1*img->size_pixels+i];
    color.B = img->pixel[2*img->size_pixels+i];
    return color;
}


void vx_image_fillgray(Image_t *&img, unsigned char gray){
    unsigned long i;
    for (i=0; i<img->size_pixels; ++i){
        vx_image_setgray(img, i, gray);
    }
}
void vx_image_setgray(Image_t *&img, int i, unsigned char gray){
    img->pixel[i] = gray;
}
unsigned char vx_image_getgray(Image_t *&img, int i){
    return img->pixel[i];
}


void vx_image_draw_regions(unsigned char *&pixel, unsigned long size_pixels, unsigned long *&label, unsigned long size_labels){
    //if(img->channels==3){
    //clock_t start = clock();
    //clock_t end;

    Color3RGB* colors = makecolor(size_labels);
    Color3RGB c; 
    unsigned long i;
    for (i=0; i<size_pixels; i++){
        c = colors[label[i]];
        pixel[0*size_pixels+i] = c.R;
        pixel[1*size_pixels+i] = c.G;
        pixel[2*size_pixels+i] = c.B;
    }
    free(colors);

    //end = clock();
    //printf("time draw regions: %f\n", (double)(end - start)/CLOCKS_PER_SEC);
    //}
}

void vx_image_draw_regions_limits(unsigned char *&pixel, unsigned long size_pixels, unsigned long *&label, int width, int height){
    //if(img->channels==3){
    clock_t start = clock();
    clock_t end;

    int x, y;
    unsigned long i, j;
    for(y=1;y<height-1;++y){
        for(x=1;x<width-1;++x){
            i = y*width+x;
            for(j=0;j<4;++j){
                j = (y+y8[j])*width+(x+x8[j]);
                if(label[i]!=label[j]){
                    pixel[0*size_pixels+i] = WHITE_D.R;
                    pixel[1*size_pixels+i] = WHITE_D.G;
                    pixel[2*size_pixels+i] = WHITE_D.B;
                    //break;
                }
            }
        }
    }
    end = clock();
    printf("time draw regions limits: %f\n", (double)(end - start)/CLOCKS_PER_SEC);
    //}
}


void vx_image_seg_read(
    char filename[],
    int width, int height, unsigned long &size_labels, unsigned long *&label,
    unsigned long *&next, unsigned long *&region, unsigned long *&regionsize,
    unsigned long *&target, char**& name_targets, unsigned long *size_targets
){
    clock_t end, start = clock();

//    printf("PATHFILE %s\n",filename);
    FILE* fp = fopen(filename, "r");
    if (fp == NULL) exit(EXIT_FAILURE);

    char* line = NULL;
    size_t len = 0;
    ssize_t read = 0;
    char *words[256];
    const char *delim = " ";
    const char *delim2 = "\n";
    int sizetokens = 0;
    int r, w, h;
    unsigned long i, j, t, c1, c2; 

    read = getline(&line, &len, fp);
    read = getline(&line, &len, fp);
    read = getline(&line, &len, fp);
    read = getline(&line, &len, fp);
    read = getline(&line, &len, fp);

    vx_maketokens(line, delim, words, sizetokens);
    w = atoi(words[1]);
    
    read = getline(&line, &len, fp);
    vx_maketokens(line, delim, words, sizetokens);
    h = atoi(words[1]);

    assert(w==width && h==height);
    width = w;
    height = h;

    read = getline(&line, &len, fp);
    vx_maketokens(line, delim, words, sizetokens);
    size_labels = atoi(words[1]);

    read = getline(&line, &len, fp);
    read = getline(&line, &len, fp);
    read = getline(&line, &len, fp);

    read = getline(&line, &len, fp);
    vx_maketokens(line, delim, words, sizetokens);
    *size_targets = atoi(words[1]);

    //read target's names
    for(i=0; i<*size_targets;++i){
        read = getline(&line, &len, fp);
        vx_maketokens(line, delim2, words, sizetokens);
        strcpy(name_targets[i], line);
    }

    //read values of targets for each regions
    //segmentstargets
    read = getline(&line, &len, fp);
    for(i=0; i<size_labels;++i){
        read = getline(&line, &len, fp);
        target[i] = atoi(line);
    }

    //data
    read = getline(&line, &len, fp);

    for (i=0; i<size_labels; ++i){
        regionsize[i] = 0;
    }

    while ((read = getline(&line, &len, fp)) != -1) {
        vx_maketokens(line, delim, words, sizetokens);
        t = atoi(words[0]);
        r = atoi(words[1]);
        c1 = atoi(words[2]);
        c2 = atoi(words[3]);

        for (j=c1; j<=c2; ++j){
            i = r*width+j;
/* 
            imgData->x[i] = j;
            imgData->y[i] = r;
*/
            next[i] = region[t];
            region[t] = i;
            regionsize[t]++;

            label[i] = t;
        }    
    }

    fclose(fp);
/*     if (line)
        free(line); */
    
    end = clock();
    printf("time read seg: %f\n", (double)(end - start)/CLOCKS_PER_SEC);

}

void vx_image_seg_write(
    char filename[], char name[], int width, int height,
    unsigned long *&label, unsigned long size_labels,
    unsigned long *&target,  char**& name_targets, unsigned long *size_targets
){

    clock_t end, start = clock();
    
    FILE* fp = fopen(filename, "w");
    if (fp == NULL) exit(EXIT_FAILURE);
    int x, y, c1;
    unsigned long j;
    unsigned long i, la, l;
    
    char bufft[100];
    time_t now = time (0);
    strftime (bufft, 100, "%Y-%m-%d %H:%M:%S", localtime(&now));

    fprintf (fp, "format ascii cr\n");
    fprintf (fp, "%s\n", bufft);
    //fprintf (fp, "image:%s\n", name);
    fprintf (fp, "%s\n", name);
    fprintf (fp, "user ?\n");
    fprintf (fp, "width %d\n", width);
    fprintf (fp, "height %d\n", height);
    fprintf (fp, "segments %lu\n", size_labels);
    fprintf (fp, "gray 0\n");
    fprintf (fp, "invert 0\n");
    fprintf (fp, "flipflop 0\n");
    
    fprintf (fp, "targets %ld\n", *size_targets);
    for(j=0; j<*size_targets;++j){
        fprintf (fp, "%s\n", name_targets[j]);
    }

    fprintf (fp, "segmentstargets:\n");
    for(i=0; i<size_labels;++i){
        fprintf (fp, "%ld\n", target[i]);
    }
     
    fprintf (fp, "data:\n");
    for(y=0; y<height; ++y){
        c1 = 0;
//        c2 = 0;
        la = label[y*width];
        for(x=0; x<width; ++x){
            i = y*width+x;
            l = label[i];
            if(la!=l){
                fprintf (fp, "%lu %d %d %d\n", la, y, c1, (x-1));
                c1=x;
                la=l;
            }
        }    
        fprintf (fp, "%lu %d %d %d\n", la, y, c1, (width-1));
    }
    fclose(fp);

    end = clock();
    printf("time write seg: %f\n", (double)(end - start)/CLOCKS_PER_SEC);

}

void vx_image_seg_width_height(char filename[], int &width, int &height){
    FILE* fp = fopen(filename, "r");
    if (fp == NULL)
        exit(EXIT_FAILURE);
    char* line = NULL;
    size_t len = 0;
    ssize_t read = 0;
    char *words[20];
    const char *delim = " ";
    int sizetokens = 0;
    read = getline(&line, &len, fp);
    read = getline(&line, &len, fp);
    read = getline(&line, &len, fp);
    read = getline(&line, &len, fp);
    read = getline(&line, &len, fp);
    
    vx_maketokens(line, delim, words, sizetokens);
    width = atoi(words[1]);
    
    read = getline(&line, &len, fp);
    vx_maketokens(line, delim, words, sizetokens);
    height = atoi(words[1]);
    
    read = getline(&line, &len, fp);
    vx_maketokens(line, delim, words, sizetokens);
    //sizelables = atoi(words[1]);

    len = read+1;
    fclose(fp);
/*     if (line)
        free(line); */
}


void vx_image_update_regions(Image_t *&img){
    clock_t start = clock();
    clock_t end;

    unsigned long* aux = (unsigned long*)malloc(img->size_pixels*sizeof(unsigned long));
    unsigned long i, j, label;
    unsigned long count = 0;
    unsigned long dif = -1;

    for (i=0; i<img->size_pixels; ++i){
        aux[img->label[i]] = dif;
        img->next[i] = dif;
        //img->region[i].size = 0;
    }

    for (i=0; i<img->size_pixels; ++i){
        /* code */
        label = img->label[i];

        if (aux[label] == dif){
            aux[label] = count;
            count++;
        }
        j = aux[label];

        img->next[i] = img->region[j];
        img->region[j] = i;
        img->regionsize[j]++;

        img->label[i] = j;


        /* img->pixel[i].next = &*(img->region[j].next);
        img->region[j].next = &img->pixel[i];
        img->region[j].size++;

        img->pixel[i].label = j; */
    }
    img->size_labels = count;

    free(aux);
    
    end = clock();
    printf("time update regions: %f\n", (double)(end - start)/CLOCKS_PER_SEC);
}

void vx_image_gray_update_b_in_a(
    Image_t *&img_a, unsigned char a, unsigned long la,
    Image_t *&img_b, unsigned char b, unsigned long lb
){
    clock_t end, start = clock();
    unsigned long i, t;

    for (i=0; i<img_a->size_pixels; ++i){
        img_a->label[i] = 0;
        img_a->regionsize[i] = 0;
    }

    for (i=0; i<img_a->size_pixels; ++i){
        if (img_a->pixel[i]==a){
            img_a->label[i] = la;
        }
        if (img_b->pixel[i]==b){
            img_a->label[i] = lb;
        }
    }

    for (i=0; i<img_a->size_pixels; ++i){
        t = img_a->label[i];

        img_a->next[i] = img_a->region[t];
        img_a->region[t] = i;
        img_a->regionsize[t]++;
    }
    img_a->size_labels = 3;

    end = clock();
    printf(" cc time update b in a: %f\n", (double)(end - start)/CLOCKS_PER_SEC);


}

void vx_copy(void *dest, void *source, size_t n){
    memcpy (dest, source, n*sizeof(dest));
}

void vx_maketokens(char *line, const char *delim, char **words, int sizetokens){
    char *token = strtok(line, delim);
    int i = 0;
    while (token != NULL) {
        words[i] = token;
        token = strtok(NULL,delim);
        i++;
    }
    sizetokens = i;
}

#endif