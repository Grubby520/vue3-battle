#!/bin/bash

sed -i 's/\$GATEWAY_URL/'"$GATEWAY_URL"'/g' /etc/nginx/nginx.conf
sed -i 's/\$GATEWAY_PORT/'"$GATEWAY_PORT"'/g' /etc/nginx/nginx.conf
echo "{ \"env\": \"${web_env:-dev}\"}" > /usr/share/nginx/html/static/env.json

# service nginx start
nginx -g 'daemon off;'
