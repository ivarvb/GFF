#ifndef COLOR3RGB_H
#define	COLOR3RGB_H

#include <stdlib.h>
#include <time.h>

/**
 * @Array of values of pixels (r) or (g) or (b) or (gray scale)
 */
//typedef unsigned int PixelData;
//#define srand(time(NULL));

//typedef unsigned char PixelData;
typedef struct Color3RGB Color3RGB;

double toGray(Color3RGB c);
Color3RGB random_rgb();
Color3RGB* makecolor(int n);


typedef struct Color3RGB{
    unsigned char R, G, B;
}Color3RGB;

Color3RGB
              BLACK_D = { 0,0,0 },
                RED_D = { 255,0,0 },
              GREEN_D = { 0,255,0 },
               BLUE_D = { 0,0,255 },

             YELLOW_D = { 255,236,0 },
              WHITE_D = { 255,255,255 },
               //BLUE_D = { 0,134,203 },
            SKYBLUE_D = { 40,155,255 },
               PINK_D = { 255,100,255 },
             PURPLE_D = { 117,71,177 },
             ORANGE_D = { 241,112,34 },
               CYAN_D = { 0,255,255 },
               GREY_D = { 127, 127, 127 };

double toGray(Color3RGB c){
    return  0.299 * c.R +
            0.587 * c.G +
            0.114 * c.B ;
}

Color3RGB random_rgb(){ 
    Color3RGB c = { (unsigned char)rand(), (unsigned char)rand(), (unsigned char)rand() };
    return c;
}

Color3RGB* makecolor(int n){
    Color3RGB *colors = (Color3RGB*)calloc(n,sizeof(Color3RGB));
    int i;
    if (n<=3){
        colors[0] = BLACK_D;
        colors[1] = GREEN_D;
        colors[2] = RED_D;
    }
    else{
        for (i=0; i<n; ++i){
            colors[i] = random_rgb();
            //printf("(%d, %d, %d)",colors[i].R, colors[i].G, colors[i].B);
        }
        colors[0] = BLACK_D;
    }
    return colors;
}

#endif


