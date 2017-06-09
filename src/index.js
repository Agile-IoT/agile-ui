import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import configureStore from './store';
import {
  App,
  Discover,
  Devices,
  Device,
  DeviceSecurity,
  DeviceCredential
} from './containers';

// global styles
import './styles/index.css';

// redux store
const store = configureStore();

// material ui
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

render(
  <Provider store={store}>
    <MuiThemeProvider>
      <Router history={browserHistory}>
        <Route path="/" component={App}>
          <IndexRoute component={Discover} />
          <Route path="devices" component={Devices} />
          <Route path="devices/:deviceId" component={Device} />
          <Route path="devices/:deviceId/security" component={DeviceSecurity} />
          <Route path="devices/:deviceId/credential/" component={DeviceCredential} />

        </Route>
      </Router>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root')
);
