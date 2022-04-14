#!/bin/bash
#ev="../python38pgff/"
ev="./python/python38gff/"
install () {
    rm -r $ev
    mkdir $ev
    python3 -m venv $ev
    source $ev"bin/activate"

    # install packages
    # pip3 install -r requirementspgff.txt
    pip3 install wheel==0.37.1
    pip3 install numpy==1.21
    pip3 install scikit-sparse==0.4.6
    pip3 install tornado==6.1
    pip3 install ujson==5.1.0
    pip3 install matplotlib==3.5.1
    pip3 install scikit-learn==1.0.2
    pip3 install pandas==1.4.0
    pip3 install cython==0.29.26
    pip3 install pymongo==4.0.1
    pip3 install bcrypt==3.2.0
    pip3 install scipy==1.7.3
    pip3 install umap-learn==0.5.2
    pip3 install MulticoreTSNE==0.1

    compile
}
compile () {
    source $ev"bin/activate"
    
    #compile task 1
    cd ./sourcecode/src/vx/com/px/dataset/
    sh Makefile.sh

    cd ../../../../../../

    #compile task 2
    cd ./sourcecode/src/vx/gff/graphtree/
    sh Makefile.sh
}
execute(){
    source $ev"bin/activate"

    cd ./sourcecode/src/
    python3 GFF.py
}


docker(){
    #initialize mongodb
    mongod --fork --dbpath=/app/gff/data/db --logpath=/app/gff/data/mongo.log &
    #mongod --fork --dbpath=/app/gff/data/db --logpath=/app/gff/data/mongo.log &
    #mongod &
    #mongod &

    #compile task 1
    cd ./sourcecode/src/vx/com/px/dataset/
    python3 setup.py clean --all
    python3 setup.py build_ext --inplace
    
    
    cd ../../../../../../
    
    #compile task 2
    cd ./sourcecode/src/vx/gff/graphtree/
    python3 setup.py clean --all
    python3 setup.py build_ext --inplace

    cd ../../../../../

    cd ./sourcecode/src/
    python3 GFF.py


}

args=("$@")
T1=${args[0]}
if [ "$T1" = "install" ]; then
    install
elif [ "$T1" = "compile" ]; then
    compile
elif [ "$T1" = "docker" ]; then
    docker
elif [ "$T1" = "execute" ]; then
    execute
else
    execute
fi