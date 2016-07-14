import { takeEvery } from 'redux-saga'
import { call, put, fork } from 'redux-saga/effects'
import * as types from '../constants/ActionTypes'
import { requester, redirector, deviceCRUD } from '../utils'
import { BASE_API } from '../constants/Endpoints'

function* deviceListeners() {
  yield takeEvery([types.DEVICE_FETCH], deviceCRUD)
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
  yield put({ type: types.DEVICE_FETCH, method: 'GET', resource: BASE_API + '/devices', device: id })
}
