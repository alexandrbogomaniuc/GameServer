#!/bin/bash
set -e

# Substitute environment variables in nginx config
# We explicitly list variables we expect to replace to avoid accidental replacement of nginx variables like $host
envsubst '${LOBBY_DOMAIN}' < /etc/nginx/sites-enabled/games > /etc/nginx/sites-enabled/games.tmp
mv /etc/nginx/sites-enabled/games.tmp /etc/nginx/sites-enabled/games

# Start SSH (as per original Dockerfile)
service ssh start

# Start Nginx
exec nginx -g "daemon off;"
