FROM node:14.20.0-alpine

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
CMD npm run start