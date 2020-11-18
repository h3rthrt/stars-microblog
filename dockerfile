FROM node:11.4.0

RUN mkdir -p /srv/www/stars-backend
WORKDIR /srv/www/stars-backend

COPY ./stars-backend/package-lock.json ./
COPY ./stars-backend/package.json ./
RUN npm install

COPY ./stars-backend .