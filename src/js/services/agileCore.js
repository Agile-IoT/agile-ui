import axios from 'axios'
import { Schema, arrayOf, normalize } from 'normalizr'
import { BASE_API } from '../constants/Endpoints'
import { isEmpty } from 'lodash'
function callApi(method, url, body, schema) {
  return axios({
    method: method,
    url: url,
    headers: [],
    data: JSON.stringify(body)
  })
  .then(response => {
    // check if there is content
    if (isEmpty(response.data))
      return response
    if (response.status === 204)
      return response
    return Object.assign({},
      normalize(response.data, schema)
    )
  })
  .then(
    response => ({response})
  )
  .catch(error => ({error: error.message || 'Something bad happened'}))
}

// We use this Normalizr schemas to transform API responses from a nested form
// to a flat form where repos and users are placed in `entities`, and nested
// JSON objects are replaced with their IDs. This is very convenient for
// consumption by reducers, because we can easily build a normalized tree
// and keep it updated as we fetch more data.
// Read more about Normalizr: https://github.com/gaearon/normalizr

const registeredDeviceSchema = new Schema('registeredDevices', {
  idAttribute: 'deviceId'
})
const registeredDeviceSchemaArray = arrayOf(registeredDeviceSchema)

const deviceSchema = new Schema('devices', {
  idAttribute: 'id'
})
const deviceSchemaArray = arrayOf(deviceSchema)

const protocolsSchema = new Schema('protocols', {
  idAttribute: 'id'
})
const protocolsSchemaArray = arrayOf(protocolsSchema)

// entities
export const deviceFetch = deviceId => callApi('GET', `${BASE_API}/devices/${deviceId}`, null, registeredDeviceSchema)
export const registeredDevicesFetch = () => callApi('GET', `${BASE_API}/devices`, null, registeredDeviceSchemaArray)
export const devicesFetch = () => callApi('GET', `${BASE_API}/protocols/devices`, null, deviceSchemaArray)
export const deviceDelete = deviceId => callApi('DELETE', `${BASE_API}/device/${deviceId}`)
export const deviceRegister = device => callApi('POST', `${BASE_API}/devices`, device)

// settings
export const protocolsFetch = () => callApi('GET', `${BASE_API}/protocols`, null, protocolsSchemaArray)
export const discoveryOn = () => callApi('POST', `${BASE_API}/protocols/discovery`)
export const discoveryOff = () => callApi('DELETE', `${BASE_API}/protocols/discovery`)
