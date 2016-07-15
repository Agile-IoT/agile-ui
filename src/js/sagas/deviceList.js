import { delay, takeEvery } from 'redux-saga'
import { call, put, fork, cancelled } from 'redux-saga/effects'
import * as types from '../constants/ActionTypes'
import { requestHandler, redirector } from '../utils'
import { BASE_API } from '../constants/Endpoints'
import { deviceListFetch, deviceProvision } from '../actions/deviceList'

function* deviceListPoll(action) {
  try {
    while (true) {
      yield call(requestHandler, action)
      yield call(delay, 2500)
    }
  } finally {
    if (yield cancelled())
      // any clean up actions here
      yield
  }
}

function* provisioner(action) {
  // yield put(deviceProvision(action.prevAction.body))
  // redirects user from /discovery to device list after successful registration
  yield call(redirector, '/')
}

function* registerationWatcher() {
  yield takeEvery(types.DEVICE_REGISTER_SUCCEEDED, provisioner)
}

export function* deviceListSaga(route) {
  const action = yield put(deviceListFetch(route))
  yield fork(deviceListPoll, action)
  yield fork(registerationWatcher)
  yield takeEvery([types.DEVICE_DELETE, types.DEVICE_REGISTER, types.DEVICE_PROVISION], requestHandler)
}
