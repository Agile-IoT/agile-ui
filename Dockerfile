FROM resin/raspberry-pi3-node:7.8.0-20170426

ARG BASEIMAGE_BUILD=resin/raspberry-pi3-node:7.8.0-20170426

# Defines our working directory in container
WORKDIR /home

# Copies the package.json first for better cache on later pushes
COPY package.json package.json

RUN npm -d install

COPY . .

# RUN npm run build

EXPOSE 1337

CMD node ./server.js
