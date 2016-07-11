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

export function* deviceSaga() {
  yield fork(deviceListeners)
  yield fork(deviceRedirectors)
}
