FROM node:14.20.0-alpine

WORKDIR /usr/src/app
COPY package*.json ./
COPY yarn.lock ./
RUN yarn install
COPY . .
CMD yarn start