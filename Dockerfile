#operative system
FROM ubuntu:20.04

MAINTAINER Ivar Vargas Belizario "l.ivarvb@gmail.com"
ENV DEBIAN_FRONTEND=noninteractive


######################################
############## Install necessary libs ###############
RUN apt-get update -y && \
    apt-get install -y apt-utils 2>&1 | grep -v "debconf: delaying package configuration, since apt-utils is not installed" && \
    apt-get install -y wget gnupg gnupg2 curl  && \
    apt-get install -y --reinstall systemd  && \
    apt-get install -y python3-pip python3-dev gcc build-essential cmake python3 python3-venv python3-pip python3-scipy libsuitesparse-dev && \
    rm -rf /var/lib/apt/lists/*


# ######################################
# ############## MONGODB ###############
RUN wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | apt-key add -
RUN echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-5.0.list
RUN apt-get update
RUN apt-get install -y mongodb-org=5.0.2 mongodb-org-database=5.0.2 mongodb-org-server=5.0.2 mongodb-org-shell=5.0.2 mongodb-org-mongos=5.0.2 mongodb-org-tools=5.0.2

#RUN sed -i "s,\\(^[[:blank:]]*bindIp:\\) .*,\\1 0.0.0.0," /etc/mongod.conf
#RUN mkdir -p /data/db
#RUN mkdir /data/db
#RUN chmod 777 -R /data

#RUN mkdir -p /data/db
#CMD ["--port", "27017", "--fork", "--port", "27017", "--dbpath","/app/gff/data/db", "--logpath","/app/gff/data/mongo.log"]    
#ENTRYPOINT ["/usr/bin/mongod"]
#EXPOSE 27017
#ENTRYPOINT ["/usr/bin/mongod"]
#CMD mongod


# ############## MONGODB ###############
# ######################################


##################################
############## GFF ###############
COPY requirements.txt /app/gff/requirements.txt
WORKDIR /app/gff
RUN pip3 install -r requirements.txt
COPY . /app/gff

#RUN ["mongod", "--dbpath=/app/gff/data/db", "--logpath=/app/gff/data/mongo.log"]


WORKDIR /app/gff
CMD bash GFF.sh docker
############## GFF ###############
##################################

