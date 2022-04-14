#from igraph import *
import igraph as ig


from vx.com.px.ex import Dataset
from vx.com.px.ex import ProxMat

class Network:
    def __init__(self, N, initlabels=None):
        self.size = N
        self.labels = [-1 for i in range(N)]
        self.labelsfixed = [False for i in range(N)]
        self.edges = []
        self.weight = []
        self.root = [{} for i in range(N)]
        self.communities = []
        self.communities_model = None
        self.g = None

    # def set_init_label(self, initlabels=None):
    #     self.initlabels = initlabels

    # def set_init_label_fixed(self, initlabelsfixed=None):
    #     self.initlabelsfixed = initlabelsfixed

    def clusters(self):
        return self.communities

    def convert_to_igraph(self):
        N = self.size
        # edges = []
        # for i in range(len(self.source)):
        #     edges.append((self.source[i], self.target[i]))

        self.g = ig.Graph(   n=N,
                        edges=self.edges,
                        edge_attrs={'weight': self.weight},
                        #vertex_attrs={"id": self.labels, "initlabels":self.initlabels, "initlabelsfixed":self.initlabelsfixed },
                    )

    def modularity(self):
        return self.g.modularity(self.communities)

    def community_detection(self, model, isinitlabels=False):
        self.communities_model = model
        self.communities = []
        if model == "multilevel":
            self.communities = self.g.community_multilevel(weights="weight")
        elif model == "fastgreedy":            
            self.communities = self.g.community_fastgreedy(weights="weight").as_clustering()

        elif model == "walktrap":
            self.communities = self.g.community_walktrap(weights="weight").as_clustering()

        elif model == "labelpropagation":
            if not isinitlabels:
                self.communities = self.g.community_label_propagation(weights="weight")
            else:
                print("initi")
                #self.communities = self.g.community_label_propagation(weights="weight", initial="initlabels")
                
                self.communities = self.g.community_label_propagation(self.weight, self.labels, self.labelsfixed)

    @staticmethod
    def create_from_dataset(dataset, limiar, proxtype):
        N = dataset.rows()
        net = Network(N)
        pmat = dataset.proximitymatrix_rows(proxtype);
        for i in range(net.size):
            for j in range(i+1, net.size):
                w = pmat.getValue(i,j)
                #print(w)
                if w<limiar:
                    net.edges.append((i,j))
                    net.weight.append(w)
                    net.root[i][j] = w
                    net.root[j][i] = w

        del pmat
        # print("net.source", len(net.source))
        # print("net.target", len(net.target))
        # print("net.weight", len(net.weight))

        return net
    
    @staticmethod
    def create_from_dataset_index(idex, dataset, pmat, limiar):
        N = len(idex)
        net = Network(N)
        for ei in range(len(idex)):
            i = idex[ei]
            for ej in range(ei+1, len(idex)):
                j = idex[ej]
                w = pmat.getValue(i,j)
                #print(w, limiar)
                if w<limiar:
                    net.edges.append((ei,ej))
                    net.weight.append(w)
                    net.root[ei][ej] = w
                    net.root[ej][ei] = w

        return net
    
    @staticmethod
    def create_from_network(network, limiar):
        net = Network(network.size)
        for i in range(len(network.edges)):
                w = network.weight[i]
                #print(w)
                if w<limiar:
                    net.edges.append(network.edges[i])
                    # net.target.append(network.target[i])
                    net.weight.append(network.weight[i])
        return net
