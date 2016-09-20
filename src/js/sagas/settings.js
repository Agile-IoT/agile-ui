import { takeEvery } from 'redux-saga'
import { call, put} from 'redux-saga/effects'
import * as actions from '../actions/settings'
import { agileCore } from '../services'
import { newMessage } from '../actions/messages'
import { fetchEntity } from './utils'

export const protocolsFetch = fetchEntity.bind(null, actions.protocolsFetch, agileCore.protocolsFetch)

export function* settingsSaga() {
  yield call(protocolsFetch)
  yield takeEvery('SETTINGS_DISCOVERY_TOGGLE_REQUEST', discoveryToggleSaga)
}

export function* discoveryToggleSaga(action) {
  let apiFn
  let entity = actions.discoveryToggle
  let message
  if (action.result) {
    message = 'Discovery Successfully Turned Off'
    apiFn = agileCore.discoveryOff
  } else {
    message = 'Discovery Successfully Turned On'
    apiFn = agileCore.discoveryOn
  }
  const {response, error} = yield call(apiFn)
  if(response) {
    yield put(entity.success(action.result, response))
    yield put(newMessage(message))
  } else {
    yield put( entity.failure(action.result, error) )
    yield put(newMessage(error))
  }
}
