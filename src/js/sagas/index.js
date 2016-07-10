import { fork } from 'redux-saga/effects'
import {deviceListSaga} from './deviceList'
import {settingsSaga} from './settings'
import {deviceSaga} from './device'

export function* rootSaga() {
  yield fork(deviceListSaga)
  yield fork(settingsSaga)
  yield fork(deviceSaga)
}
