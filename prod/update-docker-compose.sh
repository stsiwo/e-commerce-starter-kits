#!/bin/bash
set -e

# update docker-compose when files are uploaded to production

# use incron to trigger this bash script to be run
# flows:
#  1. upload files including 'update-trigger.txt', 'update-docker-compose.sh' (this file)
#  2. incron detect update-trigger.txt is updated, then run this update-docker-compose.sh

# NOTE:
#  - this file does not executed by incron esp for first time.
#  - this is because trigger file and update-docker-compose.sh does not exist at statup.sh
#  - in this case, you need to update the 'sudo incrontab -e' after first upload 'prod-app'
#  - also, don't forget use absolute path

# write stdout/err to syslog
exec 1> >(logger -s -t $(basename $0)) 2>&1

echo "start taking the backup with mysql-backup container by restarting the service"
echo "mysql-backup service name must match the name in docker compose file"

#docker-compose restart db-backup

echo "backup succeeded so moves to the next step"
echo "start update docker-compose since we detect new files are uploaded here"

echo "start pull docker image from DockerHub"
# pull docker images from DockerHub (no tag is specified so this pickup latest tag)
docker pull stsiwo/ec-spa
docker pull stsiwo/ec-api
docker pull stsiwo/ec-db

echo "start update docker-compose"
# update docker-compose
docker-compose -f /home/ubuntu/prod/docker-compose.secret.yml -f /home/ubuntu/prod/docker-compose.yml down --remove-orphans 

systemctl restart docker

docker-compose -f /home/ubuntu/prod/docker-compose.secret.yml -f /home/ubuntu/prod/docker-compose.yml up -d

echo "clean up the unused docker components"
docker system prune -f

echo "done running docker compose update"

