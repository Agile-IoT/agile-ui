import * as types from '../constants/ActionTypes'

const initialState = {
  item: {},
  error: null,
  loading: 'hide'
}

export default function (state = initialState, action) {
  let error

  switch (action.type) {

    case types.DEVICE_FETCH_REQUESTED:
      return {
        ...state,
        loading: 'loading'
      }
    case types.DEVICE_FETCH_SUCCEEDED:
      console.log('reducer', action.data)
      return {
        ...state,
        item: action.data,
        loading: 'hide'
      }
    case types.DEVICE_FETCH_FAILED:
      error = action.data || {
        message: action.data.message
      }
      return {
        ...state,
        item: [],
        error: error,
        loading: 'hide'
      }

    default:
      return state
  }
}
