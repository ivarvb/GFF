#compile task 1
cd ./sourcecode/src/vx/com/px/dataset/
python3 setup.py clean --all
python3 setup.py build_ext --inplace


cd ../../../../../../

#compile task 2
cd ./sourcecode/src/vx/pgff/graphtree/
python3 setup.py clean --all
python3 setup.py build_ext --inplace

cd ../../../../../

cd ./sourcecode/src/
python3 PGFF.py

