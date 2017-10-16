import { createStore, applyMiddleware, compose } from 'redux';
import persistState from 'redux-localstorage'
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const applyDevMiddleware = () => {
  if (process.env.NODE_ENV === `development`) {
    const createLogger = require(`redux-logger`);
    return applyMiddleware(createLogger())
  }
}

const middlewares = compose(
  applyMiddleware(thunk),
  persistState('discovery'),
  applyDevMiddleware()
)

export default function configureStore(initialState) {
  return createStore(
    rootReducer,
    initialState,
    middlewares
  );
}
