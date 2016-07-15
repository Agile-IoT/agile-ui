// Any deviceList triggers go here
import * as types from '../constants/ActionTypes'
import { BASE_API } from '../constants/Endpoints'

// these function act as trigger functions to run sagas. They should only be called when a user interacts with the page.
// route handling triggers only occur when

export function deviceFetch(deviceId) {
  return {
    type: types.DEVICE_FETCH,
    method: 'GET',
    url: `${BASE_API}/devices/${deviceId}`,
    body: null
  }
}

export function deviceDelete(device) {
  return {
    type: types.DEVICE_DELETE,
    method: 'DELETE',
    url: `${BASE_API}/devices/${device.id}`,
    body: null,
    confirm: true,
    confirmation: 'Device successfully Deleted'
  }
}
