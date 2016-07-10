import { takeEvery } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import * as types from '../constants/ActionTypes'
import requester from '../utils'

function* discovery(action) {
   try {
      const payload = yield call(requester, action.method, action.resource)
      yield put({ type: types.SETTINGS_DISCOVERY_SUCCEEDED , data: payload.data })
   } catch (e) {
      yield put({ type: types.SETTINGS_DISCOVERY_FAILED , data: e.message })
   }
}

export function* settingsSaga() {
  yield* takeEvery( types.SETTINGS_DISCOVERY_REQUESTED , discovery)
}
