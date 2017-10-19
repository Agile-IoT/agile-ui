import { createStore, applyMiddleware, compose } from 'redux';
import persistState from 'redux-localstorage'
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import createLogger from 'redux-logger';

const DEV = process.env.NODE_ENV === `development`;

const middlewares = compose(
  applyMiddleware(thunk),
  persistState('discovery'),
  DEV ? applyMiddleware(createLogger()) : (o => o)
)

export default function configureStore(initialState) {
  return createStore(
    rootReducer,
    initialState,
    middlewares
  );
}
