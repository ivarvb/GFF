extern "C"{
    #include "../../c/image/ImageIO_t.h"
}

#ifndef SNICR_H
#define	SNICR_H

#include <cmath>
#include <cfloat>
#include <vector>
#include <algorithm>
#include <queue>
#include <string>
#include <iostream>

//sudo apt install libx11-dev
//using namespace std;


class NodeOrder;

void vx_snicr(
    int width,
    int height,
    int channels,
    int side,
    unsigned char *&pixel,
    unsigned long size_pixels,
    unsigned long *&label,
    unsigned long *size_labels,
    unsigned long *&target,
    unsigned long size_targets

);
//void vx_snicr(ImageIO_t *&img, int side);




class NodeOrder{
public:
    unsigned long i;
    double d;
    unsigned long k;
    NodeOrder(){
        i = 0;
        d = 0.0;
        k = 0.0;
    }

    NodeOrder(unsigned long _i, double _d, unsigned long _k){
        i = _i;
        d = _d;
        k = _k;
    }

    bool operator<(const NodeOrder& obj) const
    {
//        //ordena de mayor hasta menor
//        return d < obj.d;
        //ordena de menor a maior 
        return d > obj.d;
    }
};






void vx_snicr(
    int width,
    int height,
    int channels,
    int side,
    unsigned char *&pixel,
    unsigned long size_pixels,
    unsigned long *&label,
    unsigned long *size_labels,
    unsigned long *&target,
    unsigned long size_targets
){
    //std::cout<<"111111111"<<std::endl;
    clock_t end, start = clock();

    int x, y, f, xj, yj;
    unsigned long j, kz;
        
    unsigned int i, k;

    double  ldist, vdist, dist, vf, xf, yf;
        
    const double M = 256.0;//10.0;
    //const double M = 0.00046;//10.0;
    double innumk = double(size_pixels)/double(side*side);
    const double invwt = (M*M*innumk)/double(size_pixels);

    unsigned long *newlabel = new unsigned long[size_pixels]();

    std::priority_queue<NodeOrder> Q;
    
    //std::cout<<"222222"<<std::endl;

    //compute centroid of grids
    const int fc = side/2;
    k=1;
    target[0] = 0;//background
    for(y=0;y<height-(side+1);y=y+side){
        for(x=0;x<width-(side+1);x=x+side){
            i = (y+fc)*width+(x+fc);
            if (label[i]>0){
                Q.push({i, -1, k});
                target[k] = label[i];//segments >0, 1,2,3,4,...
                k++;
            }
        }
    }
    //std::cout<<"3333333333333"<<std::endl;
    kz = Q.size()+1;
/*
    std::vector<double> KV(kz,0);
    std::vector<double> KX(kz,0);
    std::vector<double> KY(kz,0);
    std::vector<double> KS(kz,0); */

    double *KV = new double[kz];
    double *KX = new double[kz];
    double *KY = new double[kz];
    double *KS = new double[kz];
    for(i=0;i<kz;++i){
        KV[i]=0;KX[i]=0;KY[i]=0;KS[i]=0;
    }
    //std::cout<<"44444444444444"<<std::endl;
    NodeOrder node;
    while (!Q.empty()) { 
        node = Q.top();
        Q.pop();
        i = node.i;
        k = node.k;
        if (label[i]>0 && newlabel[i]==0){
            newlabel[i]=k;
            x = i % width;
            y = (i - x) / width;
            KV[k] += pixel[i];
            KX[k] += x;
            KY[k] += y;
            KS[k] += 1.0;

            for(f = 0; f < 8; ++f){
                xj = x+x8[f];
                yj = y+y8[f];
                if(xj>=0 && xj<width && yj>=0 && yj<height){
                    j = yj*width+xj;
                    if(label[j]>0 && label[i]==label[j] && newlabel[j]==0){
                        vf = KV[k] - pixel[j]*KS[k];
                        xf = KX[k] - xj*KS[k];
                        yf = KY[k] - yj*KS[k];
                            
                        vdist   = vf*vf;
                        ldist   = xf*xf + yf*yf;
                        dist    = (vdist + ldist*invwt)/(KS[k]*KS[k]);                            
                           
                        //dist    = vdist/(0.00001+(256.0*KS[k]));
                        
                        
                        //dist    = ldist/(0.00001+(KS[k]));

                        //dist = 0.4;
                        Q.push({j, dist, k});                            
                    }
                }
            }
        }
    }

    //std::cout<<"555555555555"<<std::endl;
    vx_copy(label, newlabel, size_pixels);
    *size_labels = kz;
    //std::cout<<"6666666666666666"<<std::endl;
    //post-processing

/*  
    KV.clear();
    KX.clear();
    KY.clear();
    KS.clear(); */
    delete[] KV;
    delete[] KX;
    delete[] KY;
    delete[] KS;
    delete[] newlabel;
    //std::cout<<"777777777777"<<std::endl;
    end = clock();
    printf("snicr time: %.8f \n", double(end - start)/ (CLOCKS_PER_SEC));
}
#endif
