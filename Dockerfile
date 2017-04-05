FROM resin/raspberrypi3-node:7.6-20170318

RUN wget \
	"https://caddyserver.com/download/build?os=linux&arch=arm" \
	-O /tmp/caddy.tar.gz \
	&& tar -xzf /tmp/caddy.tar.gz -C /usr/local/bin/ \
	&& rm /tmp/caddy.tar.gz

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
