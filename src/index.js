import React from 'react';
import { render } from 'react-dom'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import './styles/index.css';

import {
  App,
  Discover,
  Devices,
  Device
} from './containers';


// material ui
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
render(
  <MuiThemeProvider>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Discover} />
        <Route path="devices" component={Devices} />
        <Route path="devices/:device" component={Device} />
      </Route>
    </Router>
  </MuiThemeProvider>,
  document.getElementById('root')
);
