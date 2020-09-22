FROM nginx:1.15.2-alpine
FROM node:9.11
COPY ./build /var/www
COPY ./nginx/default.conf /etc/nginx/nginx.conf
EXPOSE 80

# set working directory
RUN mkdir /usr/src/app
WORKDIR /usr/src/app

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /usr/src/app/package.json
RUN npm install
RUN npm install react-scripts -g

# start app
CMD ["npm", "start"]

ENTRYPOINT ["nginx","-g","daemon off;"]