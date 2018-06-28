set -e

TAG=$1
if [ -z $TAG ]
  then echo "usage: $0 [tag]"; exit 1
fi

docker build . -t sandangel/ngcontainer:$TAG
docker tag sandangel/ngcontainer:$TAG sandangel/ngcontainer:latest
docker push sandangel/ngcontainer:$TAG
docker push sandangel/ngcontainer:latest
# git tag -a "ngcontainer_${TAG}" -m "published to docker"
# git push --tags