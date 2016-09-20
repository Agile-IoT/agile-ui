import { takeEvery } from 'redux-saga'
import { call, put, select } from 'redux-saga/effects'
import { redirector, fetchEntity } from './utils'
import * as actions from '../actions/device'
import { newMessage } from '../actions/messages'
import { agileCore } from '../services'
import { getCachedDevice } from '../reducers/selectors'

export const deviceFetch = fetchEntity.bind(null, actions.device, agileCore.deviceFetch)
export const deviceDelete = DeviceDeleteSaga.bind(null, actions.deviceDelete, agileCore.deviceDelete)

// load user unless it is cached
function* loadDeviceSaga(deviceId) {
  const device = yield select(getCachedDevice, deviceId)
  if (!device) {
    yield call(deviceFetch, deviceId)
  }
}

export function* DeviceDeleteSaga(entity, apiFn, id) {
  const {response, error} = yield call(apiFn, id)
  if(response) {
    yield put( entity.success(id, response) )
    yield put(newMessage(`Successfully deleted device ${id}`))
    yield call(redirector('/'))
  } else {
    yield put( entity.failure(id, error) )
    yield put(newMessage(error))
  }
}

export function* deviceSaga(id) {
  // get the deviceID from route
  // fetch the device
  yield call(loadDeviceSaga, id)
  yield takeEvery(['DEVICE_DELETE_REQUEST'], deviceDelete, id)
}
