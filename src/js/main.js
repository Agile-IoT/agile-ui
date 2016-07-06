import '../styles/bootstrap.min.css'
import '../styles/styles.scss'

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import configureStore  from './store/configureStore'
import { Router, browserHistory } from 'react-router'

import routes from './routes'

import injectTapEventPlugin from 'react-tap-event-plugin'
// Needed for onTouchTap for material-ui
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin()
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

const store = configureStore()
const rootElement = document.getElementById('app')

let ComponentEl

if (process.env.NODE_ENV !== 'production') {
  const DevTools = require('./containers/DevTools').default

  ComponentEl = (
    <MuiThemeProvider>
      <div>
        <Router history={browserHistory} routes={routes} />
        <DevTools />
      </div>
    </MuiThemeProvider>
  )
} else {
  ComponentEl = (
    <div>
      <Router history={browserHistory} routes={routes} />
    </div>
  )
}

// Render the React application to the DOM
ReactDOM.render(
  <Provider store={store}>
    {ComponentEl}
  </Provider>,
  rootElement
)
