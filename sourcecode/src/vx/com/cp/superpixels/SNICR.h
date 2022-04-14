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
    unsigned long size_targets,
    double factor

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
    unsigned long size_targets,
    double factor
){
    clock_t end, start = clock();

    int x, y, f, xj, yj;
    unsigned long j, kz;
        
    unsigned int i, k;

    double  ldist, vdist, dist, vf, xf, yf;
        
    //const double M = 256.0;//10.0;
    //const double M = 50.0;//10.0;
    const double M = factor;
    //const double M = side;


    //const double M = 0.00046;//10.0;
    double innumk = double(size_pixels)/double(side*side);
    const double invwt = (M*M*innumk)/double(size_pixels);


    //std::vector<unsigned long> newlabel(size_pixels, 0);
    unsigned long *newlabel = new unsigned long[size_pixels]();


    std::priority_queue<NodeOrder> Q;  

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

    kz = Q.size()+1;

/*     std::vector<double> KV(kz);
    std::vector<double> KX(kz);
    std::vector<double> KY(kz);
    std::vector<double> KS(kz); */

 
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

            for(f = 0; f < 4; ++f){
            //for(f = 0; f < 8; ++f){
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
                        //dist    = (vdist + ldist*invwt)/(KS[k]*KS[k]);
                        dist    = (vdist + ldist*invwt)/(KS[k]*KS[k]);                            
                        //dist    = (vdist*vdist*vdist)/(KS[k]*KS[k]);                            

                        
                        //dist    = (1- 1.0/(0.000001+(vdist*255)) );
                        //dist    = (vdist + invwt)/(KS[k]);
                        //dist    = (vdist + ldist*invwt)/(KS[k]*KS[k]);                            
                           
                        
                        
                        //dist    = ldist/(0.00001+(KS[k]));

                        //dist = 0.4;
                        Q.push({j, dist, k});                            
                    }
                }
            }
        }
    }

    vx_copy(label, newlabel, size_pixels);
    //vx_copy(label, &newlabel[0], size_pixels);

    
    *size_labels = kz;

     
    delete[] KV;
    delete[] KX;
    delete[] KY;
    delete[] KS;
    delete[] newlabel;
    

    end = clock();
    printf("snicr time: %.8f \n", double(end - start)/ (CLOCKS_PER_SEC));
}
#endif
