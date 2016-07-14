import { takeEvery } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import * as types from '../constants/ActionTypes'
import { requestHandler } from '../utils'

function* discovery(action) {
  yield call(requestHandler, action)
}

export function* settingsSaga() {
  yield* takeEvery( types.SETTINGS_DISCOVERY , discovery)
}
