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

WORKDIR /var/www

# mandatory for nginx-proxy
EXPOSE 80

COPY --from=build /app/dist . 
COPY ./webserver/default.conf /etc/nginx/conf.d/default.conf

