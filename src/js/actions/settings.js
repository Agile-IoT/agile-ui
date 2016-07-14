import * as types from '../constants/ActionTypes'
import { BASE_API } from '../constants/Endpoints'

export function discoveryToggle(state) {
  let method
  if (state) {
    method = 'DELETE'
  } else {
    method = 'POST'
  }
  return {
    type: types.SETTINGS_DISCOVERY,
    method: method,
    url: `${BASE_API}/protocols/discovery`
  }
}

export function drawerToggle(state) {
  return {
    type: types.SETTINGS_DRAWER_TOGGLE,
    state: state
  }
}
