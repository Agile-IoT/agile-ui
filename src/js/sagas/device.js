import { takeEvery } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import * as types from '../constants/ActionTypes'
import requester from '../utils'

function* deviceFetch(action) {
   try {
      const payload = yield call(requester, action.method, `${action.resource}/${action.device}`)
      yield put({ type: types.DEVICE_FETCH_SUCCEEDED , data: payload.data })
   } catch (e) {
      yield put({ type: types.DEVICE_FETCH_FAILED , data: e.message })
   }
}

export function* deviceSaga() {
  yield* takeEvery( types.DEVICE_FETCH_REQUESTED , deviceFetch)
}
