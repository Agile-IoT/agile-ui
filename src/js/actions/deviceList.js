// Any deviceList view triggers go here
import * as types from '../constants/ActionTypes'
import { BASE_API, MIDDLEWARE_API } from '../constants/Endpoints'

export function deviceRegister(device) {
  return {
    type: types.DEVICE_REGISTER,
    method: 'POST',
    url: `${BASE_API}/devices`,
    body: device
  }
}

export function deviceCreateDB(device) {
  return {
    type: types.DEVICE_CREATEDB,
    method: 'POST',
    url: `${MIDDLEWARE_API}/db/create`,
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
