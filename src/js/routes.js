import React from 'react'
import { Route, IndexRoute, Redirect } from 'react-router'

import App from './components/App'
import RegisteredDevices from './containers/RegisteredDevices'
import Discover from './containers/Discover'
import NotFoundView from './views/NotFoundView'

export default (
  <Route path="/" component={App}>
    <IndexRoute component={RegisteredDevices} />
    <Route path="/discover" component={Discover} />
    <Route path="404" component={NotFoundView} />
    <Redirect from="*" to="404" />
  </Route>
)
