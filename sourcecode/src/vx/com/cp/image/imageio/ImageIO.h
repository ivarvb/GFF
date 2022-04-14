extern "C"{
    #include "../../../c/image/Image_t.h"
    #include "../../../c/image/ImageIO_t.h"
}

#ifndef IMAGEIO_H
#define	IMAGEIO_H

#include <cstdio>

#include <cmath>
#include <cfloat>
#include <vector>
#include <algorithm>
#include <queue>
#include <map>
#include <string>
#include <iostream>

#include <fstream>
#include <sstream>
#include <string>
#include <cmath>
#include <cstdlib>
#include <cassert>

#include <ctime>

#include "../../superpixels/SNICR.h"

#include "../cimg/CImg.h"
using namespace cimg_library;
typedef CImg<unsigned char> ImageCImg;


/* class ImageIO_t{
//private:
public:
    int width, height, channels;
    unsigned long size_pixels, size_labels;

    unsigned char *pixel; 
    unsigned long *label;
    unsigned long *next;
    unsigned long *region;
    unsigned long *regionsize;

    unsigned long size_targets;
    unsigned long *target;
    char **name_targets; 

    ImageIO_t(char filename[], int width_, int height_, int channels_, unsigned char* fdata){
        width = width_;
        height = height_;
        channels = channels_;
        size_pixels = width*height;
        size_labels = 0;

        pixel = fdata;
        label = new unsigned long[size_pixels];
        next = new unsigned long[size_pixels];
        region = new unsigned long[size_pixels];
        regionsize = new unsigned long[size_pixels];

        size_targets = 0;
        target = new unsigned long[size_pixels];
        name_targets = new char*[256];
        for(int i=0;i<256;++i){
            name_targets[i] = new char[20];
        }

        vx_image_seg_read(
            filename,
            width, height, size_labels, label,
            next, region, regionsize,
            target, name_targets, &size_targets
        );
    }

    ImageIO_t(int width_, int height_, int channels_, unsigned char* fdata){
        //clock_t end, start = clock();

        width = width_;
        height = height_;
        channels = channels_;
        size_pixels = width*height;
        size_labels = 0;

        pixel = fdata;
        label = new unsigned long[size_pixels];
        next = new unsigned long[size_pixels];
        region = new unsigned long[size_pixels];
        regionsize = new unsigned long[size_pixels];


        size_targets = 0;
        target = new unsigned long[size_pixels];
        name_targets = new char*[256];
        for(int i=0;i<256;++i){
            name_targets[i] = new char[20];
        }
        //end = clock();
        //printf("new image: %.8f \n", double(end - start)/ (CLOCKS_PER_SEC));

    }


    ~ImageIO_t(){
        //delete[] pixel;
        for(int i=0;i<256;++i){
            delete[] name_targets[i];
        }
        delete[] name_targets;
        delete[] target;

        delete[] label;
        delete[] next;
        delete[] region;
        delete[] regionsize;
    }

    void setNameTarget(int region_i, char name[]){
        strcpy(name_targets[region_i], name);
    }
    char* getNameTarget(int region_i, char name[]){
        return name_targets[region_i];
    }

    void setTarget(unsigned long region_i, unsigned long target_id){
        target[region_i] = target_id;
    }
    int getTarget(unsigned long region_i){
        return target[region_i];
    }

    void setSizeTargets(int size){
        size_targets = size;
    }
    int getSizeTargets(){
        return size_targets;
    }

    void setColor(unsigned long i, Color3RGB color){
        pixel[0*size_pixels+i] = color.R;
        pixel[1*size_pixels+i] = color.G;
        pixel[2*size_pixels+i] = color.B;
    }
    Color3RGB getColor(int i){
        Color3RGB color;
        color.R = pixel[0*size_pixels+i];
        color.G = pixel[1*size_pixels+i];
        color.B = pixel[2*size_pixels+i];
        return color;
    }


    void setGray(unsigned long i, unsigned char gray){
        pixel[i] = gray;
    }
    unsigned char getGray(unsigned long i){
        return pixel[i];
    }

    inline void gray_update_from(
        int this_gray, int this_label,
        ImageIO_t *&ref, int ref_gray, int ref_label
    ){
        //clock_t end, start = clock();
        
        unsigned long i, t;
        size_labels = 3;
        
        for (i=0; i<size_labels; ++i){
            regionsize[i] = 0;
        }
        for (i=0; i<size_pixels; ++i){
            label[i] = 0;
        }

        for (i=0; i<size_pixels; ++i){
            if (pixel[i]==this_gray){
                label[i] = this_label;
            }
            if (ref->pixel[i]==ref_gray){
                label[i] = ref_label;
            }
        }

        for (i=0; i<size_pixels; ++i){
            t = label[i];

            next[i] = region[t];
            region[t] = i;
            regionsize[t]++;
        }

        //end = clock();
        //std::cout<<"runtime update from...: "<<double(end - start)/ (CLOCKS_PER_SEC)<<std::endl;
    }

    void copy_pixels_from(ImageIO_t*& other){
        clock_t end, start = clock();

        unsigned long i;

        //pixels
        if(other->channels==1){
            if(channels==1){
                vx_copy(pixel, other->pixel, other->size_pixels);
            }
            else if(channels==3){
                for(i=0; i<size_pixels;++i){
                    pixel[0*size_pixels+i] = other->pixel[i];
                    pixel[1*size_pixels+i] = other->pixel[i];
                    pixel[2*size_pixels+i] = other->pixel[i];
                }
            }
        }
        else if(other->channels==3){
            if(channels==1){
                for(i=0; i<size_pixels;++i){
                    pixel[i] =  0.299 * other->pixel[0*size_pixels+i] +
                                0.587 * other->pixel[1*size_pixels+i] +
                                0.114 * other->pixel[2*size_pixels+i];
                }
            }
            else if(channels==3){
                vx_copy(pixel, other->pixel, other->size_pixels*3);
            }
        }
        end = clock();
        printf("copy pixels time: : %.8f \n", double(end - start)/ (CLOCKS_PER_SEC));        
    }

    void copy_labels_from(ImageIO_t*& other){
        clock_t end, start = clock();

        unsigned long i;

        //segments
        for(i=0; i<size_pixels;++i){
            label[i] = other->label[i];
            next[i] = other->next[i];
            region[i] = other->region[i];
            regionsize[i] = other->regionsize[i];
        }
        size_labels = other->size_labels;
        

        //targets
        size_targets = other->size_targets;
        for(i=0;i<size_targets;++i){
            strcpy(name_targets[i], other->name_targets[i]);
        }
        for(i=0;i<size_labels;++i){
            target[i] = other->target[i];
        }
        
        
        end = clock();
        printf("copy labels time: : %.8f \n", double(end - start)/ (CLOCKS_PER_SEC));        
    }


    void snicr(int side){
        vx_snicr(
            width,
            height,
            channels,
            side,
            pixel,
            size_pixels,
            label,
            &size_labels,
            target,
            size_targets
        );

    }

};

 */




/* typedef struct Image_t ImageIO_t;

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
    char **name_targets; 
    ImageIO_t(int _width, int _height, int _channels, unsigned char *& _data){
        width = _width;
        height = _height;
        channels = _channels;
        size_pixels = width*height;
        size_labels = 0;

        pixel = _data;
        label = new unsigned long[size_pixels];
        next = new unsigned long[size_pixels];
        region = new unsigned long[size_pixels];
        regionsize = new unsigned long[size_pixels];


        size_targets = 0;
        target = new unsigned long[size_pixels];
        name_targets = new char*[256];
        for(int i=0;i<256;++i){
            name_targets[i] = new char[20];
        }
    }
    ~ImageIO_t(){
        //delete[] pixel;
        for(int i=0;i<256;++i){
            delete[] name_targets[i];
        }
        delete[] name_targets;
        delete[] target;

        delete[] label;
        delete[] next;
        delete[] region;
        delete[] regionsize;
    }

}ImageIO_t; */



/**
* class: ImageIO
* abstract: class to share with cython
**/
class ImageIO{
//private:  
public:
    //Image_t *_img;
    ImageCImg* _cimg;
    ImageIO_t *_img;
    //char *_img_name;
    ImageIO(char filename_[]){
        std::string filename(filename_);


        std::string exte = filename.substr(filename.find_last_of(".") + 1);
        if (exte == "tiff" || exte=="jpg" || exte == "png"){
            _cimg = new ImageCImg();
            _cimg->load(filename.c_str());
            //_img = new ImageIO_t(_cimg->width(), _cimg->height(), _cimg->spectrum(),  _cimg->_data);
            _img = vx_imageiot_create(_cimg->width(), _cimg->height(), _cimg->spectrum(), _cimg->_data);
        }
        else if( exte == "seg"){
            int channels = 3;
            int width, height;
            vx_image_seg_width_height(filename_, width, height);

            _cimg = new ImageCImg(width, height, 1, channels, 0);
            //_img = new ImageIO_t(filename_, _cimg->width(), _cimg->height(), _cimg->spectrum(),  _cimg->_data);
            _img = vx_imageiot_create(width, height, channels, _cimg->_data);

            vx_image_seg_read(
                filename_,
                _img->width, _img->height, _img->size_labels, _img->label,
                _img->next, _img->region, _img->regionsize,
                _img->target, _img->name_targets, &_img->size_targets
            );

        }

        size_t found = filename.find_last_of("/\\");
        std::string name = filename.substr(found+1);
        strcpy(_img->name, name.c_str());
    }
    
    //new with name[]
    ImageIO(char name[], int width, int height, int channels){
        
        _cimg = new ImageCImg(width, height, 1, channels, 0);
        //_img = new ImageIO_t(_cimg->width(), _cimg->height(), _cimg->spectrum(), _cimg->_data);
        _img = vx_imageiot_create(width, height, channels, _cimg->_data);

        strcpy(_img->name, name);
        //strcpy(_img->_img_name, name);
    }

    ~ImageIO(){
        //if (_cimg->_data!=NULL){
        delete[] _cimg->_data;
        //}
        //delete _cimg;
        _cimg =  NULL;


        //delete[] _img_name;
        vx_imageiot_free(_img);

        
        /* //delete _img;
        for(int i=0;i<256;++i){
            delete[] name_targets[i];
        }
        delete[] name_targets;
        delete[] target;

        delete[] label;
        delete[] next;
        delete[] region;
        delete[] regionsize; */
    }

    int width(){
        return _img->width;
    }
    
    int height(){
        return _img->height;
    }

    int size_pixels(){
        return _img->size_pixels;
    }

    int size_labels(){
        return _img->size_labels;
    }

    int channels(){
        return _img->channels;
    }


    void setNameTarget(unsigned long region_i, char name[]){
        strcpy(_img->name_targets[region_i], name);
    }
    char* getNameTarget(unsigned long region_i){
        return _img->name_targets[region_i];
    }

    void setTarget(unsigned long i, unsigned long target_){
        _img->target[i] = target_;
    }
    int getTarget(unsigned long region_i){
        return _img->target[region_i];
    }


    void setSizeTargets(int size){
        _img->size_targets = size;
    }
    int getSizeTargets(){
        return _img->size_targets;
    }

    void setColor(unsigned long i, Color3RGB color){
        _img->pixel[0*_img->size_pixels+i] = color.R;
        _img->pixel[1*_img->size_pixels+i] = color.G;
        _img->pixel[2*_img->size_pixels+i] = color.B;
    }
    Color3RGB getColor(unsigned long i){
        Color3RGB color;
        color.R = _img->pixel[0*_img->size_pixels+i];
        color.G = _img->pixel[1*_img->size_pixels+i];
        color.B = _img->pixel[2*_img->size_pixels+i];
        return color;
    }

    void setGray(unsigned long i, unsigned char gray){
        _img->pixel[i] = gray;
    }
    unsigned char getGray(unsigned long i){
        return _img->pixel[i];
    }

    void gray_update_from(
        unsigned char this_gray, unsigned long this_label,
        ImageIO *&ref, unsigned char ref_gray, unsigned long ref_label
    ){
        //clock_t end, start = clock();        
        unsigned long i, t;
        _img->size_labels = 3;
        
        for (i=0; i<_img->size_labels; ++i){
            _img->regionsize[i] = 0;
        }
        for (i=0; i<_img->size_pixels; ++i){
            _img->label[i] = 0;
        }

        for (i=0; i<_img->size_pixels; ++i){
            if (_img->pixel[i]==this_gray){
                _img->label[i] = this_label;
            }
            if (ref->_img->pixel[i]==ref_gray){
                _img->label[i] = ref_label;
            }
        }

        for (i=0; i<_img->size_pixels; ++i){
            t = _img->label[i];

            _img->next[i] = _img->region[t];
            _img->region[t] = i;
            _img->regionsize[t]++;
        }

        //end = clock();
        //std::cout<<"runtime update from...: "<<double(end - start)/ (CLOCKS_PER_SEC)<<std::endl;
    }

    void set_background_foreground(
        unsigned char bg_pixel,
        unsigned long bg_label,
        unsigned long fg_label)
    {
        vx_set_background_foreground(_img, bg_pixel, bg_label, fg_label);
    }
    
    void copy_pixels_from(ImageIO* other){
        clock_t end, start = clock();

        unsigned long i;

        //pixels
        if(other->_img->channels==1){
            if(_img->channels==1){
                vx_copy(_img->pixel, other->_img->pixel, other->_img->size_pixels);
            }
            else if(_img->channels==3){
                for(i=0; i<_img->size_pixels;++i){
                    _img->pixel[0*_img->size_pixels+i] = other->_img->pixel[i];
                    _img->pixel[1*_img->size_pixels+i] = other->_img->pixel[i];
                    _img->pixel[2*_img->size_pixels+i] = other->_img->pixel[i];
                }
            }
        }
        else if(other->_img->channels==3){
            if(_img->channels==1){
                for(i=0; i<_img->size_pixels;++i){
                    _img->pixel[i] =    0.299 * other->_img->pixel[0*_img->size_pixels+i] +
                                        0.587 * other->_img->pixel[1*_img->size_pixels+i] +
                                        0.114 * other->_img->pixel[2*_img->size_pixels+i];
                }
            }
            else if(_img->channels==3){
                vx_copy(_img->pixel, other->_img->pixel, other->_img->size_pixels*3);
            }
        }

        end = clock();
        printf("copy pixels time: : %.8f \n", double(end - start)/ (CLOCKS_PER_SEC));        
    }

    void copy_labels_from(ImageIO* other){
        clock_t end, start = clock();

        unsigned long i;

        //segments
        for(i=0; i<_img->size_pixels;++i){
            _img->label[i] = other->_img->label[i];
            _img->next[i] = other->_img->next[i];
            _img->region[i] = other->_img->region[i];
            _img->regionsize[i] = other->_img->regionsize[i];
        }
        _img->size_labels = other->_img->size_labels;
        

        //targets
        _img->size_targets = other->_img->size_targets;
        for(i=0;i<_img->size_targets;++i){
            strcpy(_img->name_targets[i], other->_img->name_targets[i]);
        }
        for(i=0;i<_img->size_labels;++i){
            _img->target[i] = other->_img->target[i];
        }
        
        end = clock();
        printf("copy labels time: : %.8f \n", double(end - start)/ (CLOCKS_PER_SEC));        
    }

    void make_regions(){
        vx_make_regions(_img);
    }

    void draw_regions_colors(){
        if (_img->channels==3){
            vx_image_draw_regions(_img->pixel, _img->size_pixels, _img->label, _img->size_labels);
        }
    }

    void draw_regions_limits(){
        if (_img->channels==3){
            vx_image_draw_regions_limits(_img->pixel, _img->size_pixels, _img->label, _img->width, _img->height);
        }
    }

    void draw_and_write_segments(char filename[]){
        int channels = 3;
        ImageIO *aux = new ImageIO(_img->name, _img->width, _img->height, channels);

        aux->copy_labels_from(this);

        vx_image_draw_regions(aux->_img->pixel, aux->_img->size_pixels, aux->_img->label, aux->_img->size_labels);
        aux->write_png(filename);

        delete aux;
    }

    void snicr(int side, double factor){
        //_img->snicr(side);
        vx_snicr(
            _img->width,
            _img->height,
            _img->channels,
            side,
            _img->pixel,
            _img->size_pixels,
            _img->label,
            &_img->size_labels,
            _img->target,
            _img->size_targets,
            factor
        );
    }

    void read_seg(char filename[]){
        vx_image_seg_read(
            filename,
            _img->width, _img->height, _img->size_labels, _img->label,
            _img->next, _img->region, _img->regionsize,
            _img->target, _img->name_targets, &_img->size_targets
        );
    }

    void write_seg(char filename[]){

        vx_image_seg_write(
            filename, _img->name, _img->width, _img->height,
            _img->label, _img->size_labels,
            _img->target, _img->name_targets, &_img->size_targets
        );
    }
    void write_png(char filename[]){
        //clock_t end, start = clock();
        _cimg->save_png(filename);
        //end = clock();
        //printf("write new png: %.8f \n", double(end - start)/ (CLOCKS_PER_SEC));
    }
    void write_tiff(char filename[]){
        _cimg->save_tiff(filename);
    }

};
//}
#endif