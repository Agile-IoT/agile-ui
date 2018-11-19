const path = require('path');
const express = require('express');
const bearerToken = require('express-bearer-token');
const proxy = require('http-proxy-middleware');
const SDK = require('sdk-temp-wip');
const compression = require('compression');

const app = express();
const agile = SDK({
  api: '/',
  idm: 'http://agile-security:3000'
})

const authMiddleware = function (req, res, next) {
  if (!req.token) {
    return res.status(401).send('Authentication failed: Please provide a token');
  }

  agile.tokenSet(req.token);

  agile.idm.user.getCurrentUserInfo()
  .then(() => {
    agile.tokenDelete();
    next();
  })
  .catch(err => {
    agile.tokenDelete();
    // forward the failed result to client
    if (err.response) {
      res.status(err.response.status).send(err.message);
    } else {
      next(err);
    }
  });
}

const proxyFactory = (name, port, ws = false) => {
  return proxy({
    target: `http://${name}:${port}`,
    // changeOrigin: true,
    pathRewrite: {
      [`^/${name}`]: ''
    },
    ws
  });
}

app.use(compression());
// All gateway traffic proxied with signature <host>/<service-name>
app.use(express.static(path.join(__dirname, 'build')));
// security handles it's own authentication.
// so one can interact with agile-security before auth middleware.
app.use(bearerToken());
app.use('/agile-security', proxyFactory('agile-security', 3000));
app.use('/agile-core', authMiddleware, proxyFactory('agile-core', 8080, true));
app.use('/agile-data', authMiddleware, proxyFactory('agile-data', 1338));
app.use('/agile-recommender', authMiddleware, proxyFactory('agile-recommender', 1338));

// catch all other routes and serve app
app.get('/*', (req, res) => {
  res.sendFile(__dirname + '/build/index.html');
});

app.listen(1337, () => console.log('Agile proxy listening!'));
