FROM node:16-alpine as dev-install
                                
WORKDIR /app                   
COPY . . 
RUN ["npm", "install"]
# CMD is executed when cotnainer is created

###########################################
FROM dev-install as build  

WORKDIR /app
RUN ["npm", "run", "build"]

###########################################
FROM nginx:1.21.0-alpine as production

# forward request and error logs to docker log collector
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log

WORKDIR /var/www


# mandatory for nginx-proxy
EXPOSE 80

COPY --from=build /app/dist . 
COPY ./webserver/templates /etc/nginx/templates
