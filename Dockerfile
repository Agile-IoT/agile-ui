FROM resin/nuc-node:7.2.1

RUN wget -qO- https://getcaddy.com | bash

# Defines our working directory in container
WORKDIR /home

# Copies the package.json first for better cache on later pushes
COPY package.json package.json

# This install npm dependencies on the resin.io build server,
# making sure to clean up the artifacts it creates in order to reduce the image size.
RUN npm install

COPY . .

RUN npm run build

EXPOSE 1337

CMD caddy -log stdout
