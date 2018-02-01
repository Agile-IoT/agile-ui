/*******************************************************************************
 *Copyright (C) 2017 Resin.io, FBK, Jolocom.
 *All rights reserved. This program and the accompanying materials
 *are made available under the terms of the Eclipse Public License v1.0
 *which accompanies this distribution, and is available at
 *http://www.eclipse.org/legal/epl-v10.html
 *
 *Contributors:
 *    Resin.io, FBK, Jolocom - initial API and implementation
 ******************************************************************************/
import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { Provider } from 'react-redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import configureStore from './store'
import {
  App,
  Discover,
  Devices,
  Entities,
  Entity,
  AddEntity,
  AddLock,
  Group,
  GroupMembers,
  Device,
  Locks,
  Graphs
} from './containers'
import './styles/index.css'
import injectTapEventPlugin from 'react-tap-event-plugin'

const store = configureStore()

injectTapEventPlugin()

render(
  <Provider store={store}>
    <MuiThemeProvider>
      <Router history={browserHistory}>
        <Route path="/" component={App}>
          <IndexRoute component={Discover} />
          <Route path="devices" component={Devices} />
          <Route path="list/:type" component={Entities} />
          <Route path="entity/:id/:type" component={Entity} />
          <Route path="devices/:deviceId" component={Device} />
          <Route path="graphs/:deviceId" component={Graphs} />
          <Route path="add/:type" component={AddEntity} />
          <Route path="group/:id/:type" component={Group} />
          <Route path="group/:group_name" component={GroupMembers} />
          <Route path="locks/:id/:type" component={Locks} />
          <Route path="lock/add/:id/:type/:field/:op" component={AddLock} />
        </Route>
      </Router>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root')
)
