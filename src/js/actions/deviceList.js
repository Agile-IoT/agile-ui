// Any deviceList triggers go here
import * as types from '../constants/ActionTypes'
import { BASE_API } from '../constants/Endpoints'

export function deviceRegister(device) {
  return {
    type: types.DEVICE_REGISTER,
    method: 'POST',
    resource: `${BASE_API}/devices`,
    body: device
  }
}

export function deviceListFetch(route) {
  let resource
  if (route === '/') {
    resource = '/devices'
  } else {
    resource = '/protocols/devices'
  }
  return {
    type: types.DEVICELIST_FETCH,
    method: 'GET',
    url: `${BASE_API}${resource}`
  }
}
