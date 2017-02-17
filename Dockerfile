FROM resin/raspberrypi3-node:7.4.0-20170216

ENV NODE_ENV production

RUN wget \
	"https://caddyserver.com/download/build?os=linux&arch=amd64&features=expires" \
	-O /tmp/caddy.tar.gz \
	&& tar -xzf /tmp/caddy.tar.gz -C /usr/local/bin/ \
	&& rm /tmp/caddy.tar.gz

# Defines our working directory in container
WORKDIR /usr/src/app

# Copies the package.json first for better cache on later pushes
COPY package.json package.json

# This install npm dependencies on the resin.io build server,
# making sure to clean up the artifacts it creates in order to reduce the image size.
RUN JOBS=MAX npm install --production --unsafe-perm && npm cache clean && rm -rf /tmp/*

COPY . .

RUN npm run build

ENTRYPOINT caddy -log stdout
