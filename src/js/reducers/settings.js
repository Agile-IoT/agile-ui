import * as types from '../constants/ActionTypes'

const initialState = {
  open: false,
  items: {
    discovery: false
  },
  error: null
}

export default function (state = initialState, action) {

  switch (action.type) {
    case types.SETTINGS_DRAWER_TOGGLE:
      return {
        ...state,
        open: !action.state
      }

    case types.SETTINGS_DISCOVERY:
    // start fetching posts and set loading = true
      return {
        ...state,
        items: { discovery: !state.items.discovery }
      }
    case types.SETTINGS_DISCOVERY_SUCCEEDED:// return list of posts and make loading = false
      return {
        ...state
      }
    case types.SETTINGS_DISCOVERY_FAILED:// return error and make loading = false
      return {
        ...state,
        items: { discovery: !state.items.discovery },
        error: action.payload
      }

    default:
      return state
  }
}
