import { takeEvery } from 'redux-saga'
import { put, fork, call } from 'redux-saga/effects'
import * as types from '../constants/ActionTypes'
import { redirector, requestHandler } from '../utils'
import { deviceFetch } from '../actions/device'
import { BASE_API } from '../constants/Endpoints'

function* deviceListeners() {
  yield takeEvery([types.DEVICE_FETCH], requestHandler)
}

function* deviceRedirectors() {
  yield takeEvery(types.DEVICE_DELETE_SUCCEEDED, redirector, '/')
}

export function* deviceSaga(route) {
  yield fork(deviceListeners)
  yield fork(deviceRedirectors)
  // get the deviceID from route
  const id = route.split("/").pop()
  // fetch the device
  yield put(deviceFetch(id))
  // yield put({ type: types.DEVICE_FETCH, method: 'GET', resource: BASE_API + '/devices', device: id })
}
