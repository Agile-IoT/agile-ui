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
  Entities,
  Entity,
  AddEntity,
  Group,
	GroupMembers,
  Device,
  Graphs
} from './containers';

// global styles
import './styles/index.css';

// material ui
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
import injectTapEventPlugin from 'react-tap-event-plugin';

// redux store
const store = configureStore();

injectTapEventPlugin();

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
        </Route>
      </Router>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root')
);
