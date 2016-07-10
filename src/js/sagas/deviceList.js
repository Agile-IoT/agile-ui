import { takeEvery } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import * as types from '../constants/ActionTypes'
import requester from '../utils'

function* deviceListFetch(action) {
   try {
      const payload = yield call(requester, action.method, action.resource)
      yield put({ type: types.DEVICELIST_FETCH_SUCCEEDED , data: payload.data })
   } catch (e) {
      yield put({ type: types.DEVICELIST_FETCH_FAILED , data: e.message })
   }
}

export function* deviceListSaga() {
  yield* takeEvery( types.DEVICELIST_FETCH_REQUESTED , deviceListFetch)
}
