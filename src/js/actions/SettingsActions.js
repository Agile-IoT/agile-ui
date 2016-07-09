import * as types from '../constants/ActionTypes'
import { BASE_URL } from '../constants/Endpoints'
import axios from 'axios'

export function discovery(method, resource) {
  const request = axios({
    method: method,
    url: BASE_URL + resource,
    headers: []
  })
  return {
    type: types.DISCOVERY,
    payload: request
  }
}

export function discoverySuccess() {
  return {
    type: types.DISCOVERY_SUCCESS
  }
}

export function discoveryFailure(error) {
  return {
    type: types.DISCOVERY_FAILURE,
    payload: error
  }
}
