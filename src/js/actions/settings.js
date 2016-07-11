import * as types from '../constants/ActionTypes'

export function discoveryToggle(state) {
  return {
    type: types.SETTINGS_DISCOVERY,
    state: state
  }
}

export function drawerToggle(state) {
  return {
    type: types.SETTINGS_DRAWER_TOGGLE,
    state: state
  }
}
