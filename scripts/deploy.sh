#!/usr/bin/env bash

ENVIRONMENT=$1
DESTDIR=$2
ROOTDIR=$(pwd)

if ! [[ $ENVIRONMENT =~ ^(staging|production)$ ]]; then
	echo "Not a valid environment: $ENVIRONMENT"
	exit 1
fi

if [[ -z $DESTDIR ]]; then
	echo "You did not provide a destination directory."
	exit 1
fi

if [ -d dist ]; then
	rm -rf dist
fi
mkdir dist

cp -r node_modules dist/

cd packages/server
npm run build-${ENVIRONMENT}

cd "$ROOTDIR/packages/web"
npm run build-${ENVIRONMENT}

# Clean the destination directory
ssh testapp "cd $DESTDIR && rm -rf node_modules public server.js"

# NOTE: The staging/production server hostname must be testapp
tar -C "$ROOTDIR/dist" -czf - . | ssh testapp "tar -C $DESTDIR -xzf -"
