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
