import axios from 'axios'
const AGILE_API = '/api'

// entities
export const deviceFetch = deviceId => axios({
  url: `${AGILE_API}/devices/${deviceId}`,
});

export const devicesFetch = deviceId => axios({
  url: `${AGILE_API}/protocols/devices`,
});

export const registeredDevicesFetch = deviceId => axios({
  url: `${AGILE_API}/devices/`,
});

export const deviceRegister = deviceId => axios({
  method: 'POST',
  url: `${AGILE_API}/devices/register`,
})

// export const registeredDevicesFetch = () => callApi('GET', `${AGILE_API}/devices`, null, registeredDeviceSchemaArray)
// export const devicesFetch = () => callApi('GET', `${AGILE_API}/protocols/devices`, null, deviceSchemaArray)
// export const deviceDelete = deviceId => callApi('DELETE', `${AGILE_API}/devices/${deviceId}`)
// export const deviceRegister = device => callApi('POST', `${AGILE_API}/devices/register`, device, registeredDeviceSchema)
// export const deviceConnect = deviceId => callApi('POST', `${AGILE_API}/device/${deviceId}/connection`, deviceId, registeredDeviceSchema)
// export const deviceTypeof = device => callApi('POST', `${AGILE_API}/devices/typeof`, device)

// settings
export const protocolsFetch = () => axios({
  url: `${AGILE_API}/protocols`,
});

export const discoveryOn = () => axios({
  method: 'POST',
  url: `${AGILE_API}/protocols/discovery`,
});

export const discoveryOff = () => axios({
  method: 'DELETE',
  url: `${AGILE_API}/protocols/discovery`,
});
