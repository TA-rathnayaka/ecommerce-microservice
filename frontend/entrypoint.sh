#!/bin/sh
echo "window.ENV = { API_BASE_URL: \"${PROXY_IP}\" };" \
  > /usr/share/nginx/html/config.js
nginx -g "daemon off;"
