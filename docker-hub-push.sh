#!/bin/bash

# v: version number (e.g., 1.0.0)
# i: image name (e.g., cms-app)
# t: multi-staging target name (e.g., build, prod, staging)
# d: target directory (e.g., ./)

echo "we are assuming you have your Dockerfile under this directory.... otherwise it won't work"

echo "build new version & latest tag for given image and push those to docker hub"

usage() { echo "Usage: $0 [-i <image name:string>] [-v <version number:string>] [-t <docker target stage name:string>] [-d <target directory where Dockerfile resides:string>]" 1>&2; exit 1; }


while getopts ":i:v:t:d:" opt; do
  case ${opt} in
    v ) # process option h
      v=${OPTARG}
      ;;
    i ) # process option t
      i=${OPTARG}
      ;;
    t ) # process option t
      t=${OPTARG}
      ;;
    d ) # process option t
      d=${OPTARG}
      ;;
    * ) usage 
      ;;
  esac
done
shift $((OPTIND -1))

echo "image: ${i}"
echo "version: ${v}"
echo "target: ${t}"
echo "directory: ${d}"

# if $v or $i is empty, exit
if [ -z "${v}" ] || [ -z "${i}" ] || [ -z "${t}" ] || [ -z "${d}" ]; then
    usage
fi

## BUILD 
# if $t is empty, build without target option, otherwise put the option
if [ -z "${t}" ]; then
  docker build --tag=${i}:${v} ${d}
else
  docker build --tag=${i}:${v} --target=${t} ${d} 
fi

## ATTACH TAG
docker image tag ${i}:${v} stsiwo/${i}:${v}
docker image tag ${i}:${v} stsiwo/${i}:latest

## PUSH 
docker image push stsiwo/${i} --all-tags

