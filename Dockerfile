FROM node
MAINTAINER Peter Strong <petterstrong007@gmail.com>

RUN mkdir /app
WORKDIR /app

COPY package.json /app/package.json
RUN npm install

# Copy App
COPY . /app
EXPOSE 3019

# Set Command
CMD npm run dev