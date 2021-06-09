import math
import numpy as np
#from fastdist import fastdist

class Proximity:
    def __init__(self):
        pass
    
    @staticmethod
    def compute(a, b, proxtype):
        p = 0.0;
        # euclidean
        if proxtype=="euclidean":
            for i in range(len(a)):
                c = a[i]-b[i]
                c = c**2
                p+=c

            # p = math.sqrt(p)
            p = np.sqrt(p)

            # a = np.array(a)
            # b = np.array(b)
            # d = [(ai - bi)**2 for ai, bi in zip(a, b)]
            # p = math.sqrt(sum(d))

        return p

    # @staticmethod
    # def computeFE(XFEi=None, XFEj=None, i=None, j=None, proxtype):
    #     p = 0.0;
    #     # euclidean
    #     if proxtype=="euclidean":
    #         #pi = ProximityMatrix.getProximityType()["Euclidean"];
    #         p = XFEi.proximity_two(XFEi, XFEj, i, j, 0)

    #     return p


class PMatrix:
    def __init__(self, n):
        self.dist = [ [] for i in range(n)]
        for i in range(n):
            self.dist[i] = [ None for j in range(n)];
                    
    def get(self, i, j):
        mi = i
        mj = j
        if j<i:
            mi = j
            mj = i

        return self.dist[mi][mj]

    def set(self, i, j, d):
        mi = i
        mj = j
        if j<i and i!=j:
            mi = j
            mj = i
        self.dist[mi][mj] = d
            
