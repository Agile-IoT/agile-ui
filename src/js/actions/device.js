import * as types from '../constants/ActionTypes'

export function deviceDelete(method, resource, device) {
  return {
    type: types.DEVICE_DELETE,
    method: method,
    resource: resource,
    device: device
  }
}
