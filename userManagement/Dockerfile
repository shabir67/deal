FROM node:16.14.0-alpine
WORKDIR /userManagement
COPY . .
RUN npm install
RUN npm i -g nodemon
CMD ["nodemon", "server.js"]