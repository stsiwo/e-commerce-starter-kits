#!/bin/bash

# v: version number (e.g., 1.0.0)
# i: image name for docker hub (e.g., ec-app)

echo "we are assuming you have your Dockerfile under this directory.... otherwise it won't work"

echo "build new version & latest tag for given image and push those to docker hub"

usage() { echo "Usage: $0 [-i <image name:string>] [-v <version number:string>] [-t <docker target stage name:string>] [-d <target directory where Dockerfile resides:string>]" 1>&2; exit 1; }


while getopts ":i:v:" opt; do
  case ${opt} in
    v ) # process option h
      v=${OPTARG}
      ;;
    i ) # process option t
      i=${OPTARG}
      ;;
    * ) usage 
      ;;
  esac
done
shift $((OPTIND -1))

echo "image: ${i}"
echo "version: ${v}"

# if $v or $i is empty, exit
if [ -z "${v}" ] || [ -z "${i}" ]; then
    usage
fi

echo "start creating spring-boot:build-image"
mvn spring-boot:build-image -Dmaven.test.skip=true

echo "start pushing the image"
## ATTACH TAG
docker image tag api:1.0-SNAPSHOT stsiwo/${i}:${v}
docker image tag api:1.0-SNAPSHOT stsiwo/${i}:latest

## PUSH 
docker image push stsiwo/${i}

echo "done"
