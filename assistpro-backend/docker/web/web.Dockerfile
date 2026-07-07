FROM nginx

ARG WORK_DIR=/var/www/html
ARG HOST_IP
ARG APP_PORT
ARG ROOT_DIR=/app/public

WORKDIR $WORK_DIR
RUN rm /etc/nginx/conf.d/default.conf
COPY ./docker/web/conf.d/app.conf /etc/nginx/conf.d/app.conf
COPY ./docker/web/entrypoint.sh /entrypoint.sh
RUN sed -i 's/\r$//' /entrypoint.sh && chmod +x /entrypoint.sh

ENV CLIENT_MAX_BODY_SIZE=1m \
    NGINX_PORT=80 \
    NGINX_HOST=_ \
    STATIC_FILES_ROOT=$ROOT_DIR \
    FASTCGI_FILES_ROOT=/app \
    FASTCGI_HOST=$HOST_IP \
    FASTCGI_PORT=$APP_PORT \
    FASTCGI_CONNECT_TIMEOUT=60 \
    FASTCGI_SEND_TIMEOUT=60 \
    FASTCGI_READ_TIMEOUT=60 \
    PHP_VALUE="" \
    TZ=Asia/Dhaka 
    
EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]

CMD ["nginx", "-g", "daemon off;"]
