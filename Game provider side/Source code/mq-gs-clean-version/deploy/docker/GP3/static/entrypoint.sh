#!/bin/bash
set -e

# Substitute environment variables in nginx config
# We explicitly list variables we expect to replace to avoid accidental replacement of nginx variables like $host
envsubst '${LOBBY_DOMAIN}' < /etc/nginx/conf.d/games.conf > /etc/nginx/conf.d/games.conf.tmp
mv /etc/nginx/conf.d/games.conf.tmp /etc/nginx/conf.d/games.conf

# Start SSH (as per original Dockerfile)
service ssh start

# Start Nginx
exec nginx -g "daemon off;"
