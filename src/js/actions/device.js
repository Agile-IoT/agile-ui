import * as types from '../constants/ActionTypes'

// these function act as trigger functions to run sagas. They should only be called when a user interacts with the page.
// route handling triggers only occur when

export function deviceDelete(method, resource, device) {
  return {
    type: types.DEVICE_DELETE,
    method: method,
    resource: resource,
    device: device
  }
}

export function deviceRegister(method, resource, device) {
  return {
    type: types.DEVICE_REGISTER,
    method: method,
    resource: resource,
    device: device
  }
}
