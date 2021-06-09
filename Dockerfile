FROM ubuntu:20.04

MAINTAINER Ivar Vargas Belizario "l.ivarvb@gmail.com"
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update \
    && apt-get install -y python3-pip python3-dev gcc build-essential cmake python3 python3-venv python3-pip python3-scipy libsuitesparse-dev \
    && rm -rf /var/lib/apt/lists/* 


COPY . /app/gff


WORKDIR /app/gff
RUN pip3 install -r requirements.txt

#WORKDIR /app/gff/sourcecode/src/vx/com/px/dataset/
#RUN python3 setup.py build_ext --inplace 

#WORKDIR /app/gff/sourcecode/src/vx/pgff/graphtree/
#RUN python3 setup.py build_ext --inplace 


WORKDIR /app/gff
CMD bash rundocker.sh
