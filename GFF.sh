#!/bin/bash
#ev="../python38pgff/"
ev="./python/python38pgff/"
install () {
    rm -r $ev
    mkdir $ev
    python3 -m venv $ev
    source $ev"bin/activate"

    # install packages
    # pip3 install -r requirementspgff.txt
    pip3 install wheel
    pip3 install numpy
    pip3 install scikit-sparse
    pip3 install tornado
    pip3 install ujson
    pip3 install matplotlib
    pip3 install sklearn
    pip3 install pandas
    pip3 install cython
    pip3 install pymongo
    pip3 install bcrypt
    pip3 install scipy
    pip3 install umap-learn
    pip3 install MulticoreTSNE
    
    compile
}
compile () {
    source $ev"bin/activate"
    
    #compile task 1
    cd ./sourcecode/src/vx/com/px/dataset/
    sh Makefile.sh

    cd ../../../../../../

    #compile task 2
    cd ./sourcecode/src/vx/pgff/graphtree/
    sh Makefile.sh
}
execute(){
    source $ev"bin/activate"

    cd ./sourcecode/src/
    python3 PGFF.py
}

args=("$@")
T1=${args[0]}
if [ "$T1" = "install" ]; then
    install
elif [ "$T1" = "compile" ]; then
    compile
else
    execute
fi