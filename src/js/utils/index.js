import axios from 'axios'
import { BASE_URL } from '../constants/Endpoints'
import { browserHistory } from 'react-router'

export function requester(method, resource) {
  return axios({
    method: method,
    url: BASE_URL + resource,
    headers: []
  })
  .then(response => ({ response }))
  .catch(error => ({ error }))
}

export function redirector(route) {
  browserHistory.push(route)
}
