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

    case types.DISCOVERY:
    // start fetching posts and set loading = true
      return {
        ...state,
        items: { discovery: !state.items.discovery }
      }
    case types.DISCOVERY_SUCCESS:// return list of posts and make loading = false
      return {
        ...state
      }
    case types.DISCOVERY_FAILURE:// return error and make loading = false
      return {
        ...state,
        items: { discovery: !state.items.discovery },
        error: action.payload
      }

    default:
      return state
  }
}
