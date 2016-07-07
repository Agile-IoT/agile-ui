import * as types from '../constants/ActionTypes'
import { BASE_URL } from '../constants/Endpoints'
import axios from 'axios';

let data = [
  { "id": 1, "Name": "GE-BULB", "status": "CONNECTED" , "Configuration": {},  "Data": {}, "LastUpdate": 1467884427, "Protocol": {} },
  { "id": 2, "Name": "Speaker", "status": "CONNECTED" , "Configuration": {},  "Data": {}, "LastUpdate": 1467884427, "Protocol": {} },
  { "id": 3, "Name": "Sensor", "status": "DISCONNECTED" , "Configuration": {},  "Data": {}, "LastUpdate": 1467884427, "Protocol": {} }
]

let err = "this is an error"

export function fetchDevices(resource) {
  const request = axios({
    method: 'get',
    url: BASE_URL + resource,
    headers: []
  })
  return {
    type: types.FETCH_DEVICES,
    payload: request
  }
}

export function fetchDevicesSuccess(posts) {
  return {
    type: types.FETCH_DEVICES_SUCCESS,
    payload: posts
  }
}

export function fetchDevicesFailure(error) {
  return {
    type: types.FETCH_DEVICES_FAILURE,
    payload: error
  }
}

export function addDevice(name) {
  return {
    type: types.ADD_DEVICE,
    name
  }
}

export function deleteDevice(id) {
  return {
    type: types.DELETE_DEVICE,
    id
  }
}

export function starDevice(id) {
  return {
    type: types.STAR_DEVICE,
    id
  }
}
