import * as types from '../constants/ActionTypes'

export function deviceFetch(method, resource, device) {
  return {
    type: types.DEVICE_FETCH,
    method: method,
    resource: resource,
    device: device
  }
}

export function deviceDelete(method, resource, device) {
  return {
    type: types.DEVICE_DELETE,
    method: method,
    resource: resource,
    device: device
  }
}
