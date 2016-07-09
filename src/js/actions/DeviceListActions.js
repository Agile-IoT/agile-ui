import * as types from '../constants/ActionTypes'
import { BASE_URL } from '../constants/Endpoints'
import axios from 'axios'

export function fetchDeviceList(resource) {
  const request = axios({
    method: 'get',
    url: BASE_URL + resource,
    headers: []
  })
  return {
    type: types.DEVICELIST_FETCH,
    payload: request
  }
}

export function fetchDeviceListSuccess(data) {
  return {
    type: types.DEVICELIST_FETCH_SUCCESS,
    payload: data
  }
}

export function fetchDeviceListFailure(error) {
  return {
    type: types.DEVICELIST_FETCH_FAILURE,
    payload: error
  }
}
