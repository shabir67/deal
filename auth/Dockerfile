FROM node:16.14.0-alpine
WORKDIR /auth
COPY . .
RUN npm install
RUN npm i -g nodemon
EXPOSE 8080
CMD ["nodemon", "server.js"]