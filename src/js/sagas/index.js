import { fork, call, take, cancel } from 'redux-saga/effects'
import { takeEvery } from 'redux-saga'
import {deviceListSaga} from './deviceList'
import {settingsSaga} from './settings'
import {deviceSaga} from './device'
import * as types from '../constants/ActionTypes'

export function* rootSaga() {
  yield fork(settingsSaga)
  yield takeEvery(types.LOCATION_CHANGE, routeHandler)
}

function* routeHandler(action) {
  if (action.payload.pathname === '/' || action.payload.pathname === '/discover' ) {
    // spawn deviceListSaga
    const saga = yield fork(deviceListSaga, action.payload.pathname)
    // kill when route changes
    yield take(types.LOCATION_CHANGE)
    yield cancel(saga)
  } else {
    yield call(deviceSaga)
  }
}
