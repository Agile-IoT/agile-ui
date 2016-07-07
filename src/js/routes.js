import React from 'react'
import { Route, IndexRoute, Redirect } from 'react-router'

import App from './components/App'
import DevicesApp from './containers/DevicesApp'
import RegisteredDevice from './containers/RegisteredDevice'
import NotFoundView from './views/NotFoundView'

export default (
  <Route path="/" component={App}>
    <IndexRoute title="Devices" component={DevicesApp} />
    <Route path="/discover" title="Discover" component={DevicesApp} />
    <Route path="/device/:id" component={RegisteredDevice} />
    <Route path="404" component={NotFoundView} />
    <Redirect from="*" to="404" />
  </Route>
)
