import axios from 'axios'
import { BASE_URL } from '../constants/Endpoints'

export default function requester(method, resource) {
  return axios({
    method: method,
    url: BASE_URL + resource,
    headers: []
  })
  .then(response => ({ response }))
  .catch(error => ({ error }))
}
