import { takeEvery } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import * as types from '../constants/ActionTypes'
import requester from '../utils'

function* deviceListFetch(action) {
  const { response, error } = yield call(requester, action.method, action.resource)
  if (response)
    yield put({ type: types.DEVICELIST_FETCH_SUCCEEDED , data: response.data })
  else
    yield put({ type: types.DEVICELIST_FETCH_FAILED , data: error })
}

export function* deviceListSaga() {
  yield* takeEvery( types.DEVICELIST_FETCH_REQUESTED , deviceListFetch)
}
