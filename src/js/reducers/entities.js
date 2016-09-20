import {merge} from 'lodash'

const initialState = {
  registeredDevices: {},
  devices: {},
  protocols: {},
  settings: {
    open: false,
    discovery: false
  }
}

let settings
// TODO probably better to split entities into multiple reducers if more custom state mutations are need
// Updates an entity cache in response to any action with response.entities
export default function entities(state = initialState, action) {
  if (action.response && action.response.entities) {
    return merge({}, state, action.response.entities)
  }
  switch (action.type) {
    case 'DEVICE_DELETE_SUCCESS':
      // remove device from cached list
      let registeredDevices = _.omit(state.registeredDevices, action.deviceId)
      return {
        ...state,
        registeredDevices
      }

    case 'SETTINGS_DRAWER_TOGGLE':
    // opens settings ui drawer
      settings = {
        ...state.settings,
        open: !state.settings.open
      }
      return {
        ...state,
        settings
      }

    case 'SETTINGS_DISCOVERY_TOGGLE_SUCCESS':
    // toggles discovery on all protocols
      settings = {
        ...state.settings,
        discovery: !state.settings.discovery
      }
      return {
        ...state,
        settings
      }
  }
  return state
}
