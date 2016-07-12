import { takeEvery } from 'redux-saga'
import { call, put, fork } from 'redux-saga/effects'
import * as types from '../constants/ActionTypes'
import { requester, redirector } from '../utils'

function* deviceCRUD(action) {
  const { response, error } = yield call(requester, action.method, `${action.resource}/${action.device}`)
  if (response)
    yield put({ type: `${action.type}_SUCCEEDED` , data: response.data })
  else
    yield put({ type: `${action.type}_FAILED` , data: error })
}

function* deviceListeners() {
  yield takeEvery([types.DEVICE_DELETE, types.DEVICE_FETCH], deviceCRUD)
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
  yield put({ type: types.DEVICE_FETCH, method: 'GET', resource: '/devices', device: id })
}
