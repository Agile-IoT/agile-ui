/*******************************************************************************
 *Copyright (C) 2017 Resin.io, FBK, Jolocom.
 *All rights reserved. This program and the accompanying materials
 *are made available under the terms of the Eclipse Public License 2.0
 *which accompanies this distribution, and is available at
 *https://www.eclipse.org/legal/epl-2.0/
 *
 *SPDX-License-Identifier: EPL-2.0
 *
 *Contributors:
 *    Resin.io, FBK, Jolocom - initial API and implementation
 ******************************************************************************/
import {createStore, applyMiddleware, compose} from 'redux';
import persistState from 'redux-localstorage'
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import createLogger from 'redux-logger';
import agileSDK from 'sdk-temp-wip'

const DEV = process.env.NODE_ENV === `development`;

const agile = agileSDK({
  api: '/agile-core',
  idm: '/agile-security',
  data: '/agile-data'
})

export const setToken = newToken => {
  agile.tokenSet(newToken)
}


const middlewares = compose(
  applyMiddleware(thunk.withExtraArgument(agile)),
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
