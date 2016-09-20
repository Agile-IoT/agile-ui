import { delay, takeEvery } from 'redux-saga'
import { call, cancelled, put, fork } from 'redux-saga/effects'
import * as actions from '../actions/deviceList'
import { redirector, fetchEntity } from './utils'
import { agileCore } from '../services'
import { newMessage } from '../actions/messages'

export const registeredDeviceList = fetchEntity.bind(null, actions.registeredDevices, agileCore.registeredDevicesFetch)
export const deviceList = fetchEntity.bind(null, actions.devices, agileCore.devicesFetch)

// TODO make deviceRegister live in global scope watching on every view
export const deviceRegister = DeviceRegisterSaga.bind(null, actions.deviceRegister, agileCore.deviceRegister)

function* _deviceListPoll(fn) {
  try {
    while (true) {
      yield call(fn)
      yield call(delay, 10000)
    }
  } finally {
    if (yield cancelled())
      // any clean up actions here
      yield
  }
}

export function* DeviceRegisterSaga(entity, apiFn, action) {
  let device = action.device
  let newDevice = {
    id: null,
    address: device.id,
    protocol: device.protocol,
    path: device.path,
    name: device.name,
    status: device.status
  }
  const {response, error} = yield call(apiFn, newDevice)

  if(response) {
    yield put( entity.success(newDevice, response) )
    yield put(newMessage(`Successfully paired device ${device.id}`))
    yield call(redirector('/'))
  } else {
    yield put( entity.failure(newDevice, error) )
    yield put(newMessage(error))
  }
}

export function* registeredDeviceListSaga() {
  yield call(registeredDeviceList)
  yield fork(_deviceListPoll, registeredDeviceList)
}

export function* deviceListSaga() {
  yield call(deviceList)
  yield takeEvery(['DEVICE_REGISTER_REQUEST'], deviceRegister)
  yield fork(_deviceListPoll, deviceList)
}
