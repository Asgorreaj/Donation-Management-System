#!/bin/sh
set -e

# Render sets $PORT dynamically; default to 10000 for local testing
export PORT="${PORT:-10000}"

# Substitute ${PORT} in the nginx template
envsubst '${PORT}' < /etc/nginx/templates/default.conf.template > /etc/nginx/sites-enabled/default.conf

exec supervisord -c /etc/supervisor/conf.d/supervisord.conf