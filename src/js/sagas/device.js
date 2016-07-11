import { takeEvery } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import * as types from '../constants/ActionTypes'
import requester from '../utils'

function* deviceFetch(action) {
  const { response, error } = yield call(requester, action.method, `${action.resource}/${action.device}`)
  if (response)
    yield put({ type: types.DEVICE_FETCH_SUCCEEDED , data: response.data })
  else
    yield put({ type: types.DEVICE_FETCH_FAILED , data: error })
}

export function* deviceSaga() {
  yield* takeEvery( types.DEVICE_FETCH_REQUESTED , deviceFetch)
}
