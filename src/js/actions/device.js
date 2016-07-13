// Any deviceList triggers go here
import * as types from '../constants/ActionTypes'

// these function act as trigger functions to run sagas. They should only be called when a user interacts with the page.
// route handling triggers only occur when

export function deviceDelete(device) {
  return {
    type: types.DEVICE_DELETE,
    method: 'DELETE',
    resource: `/devices/${device.id}`,
    body: null
  }
}

export function deviceRegister(device) {
  return {
    type: types.DEVICE_REGISTER,
    method: 'POST',
    resource: '/devices',
    body: device
  }
}
