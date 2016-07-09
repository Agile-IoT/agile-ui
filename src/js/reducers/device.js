import * as types from '../constants/ActionTypes'

const initialState = {
  device: {},
  error: null,
  loading: 'hide'
}

export default function (state = initialState, action) {
  let error

  switch (action.type) {

    case types.FETCH_DEVICE:
      return {
        ...state,
        loading: 'loading'
      }
    case types.FETCH_DEVICE_SUCCESS:
      return {
        ...state,
        devicesById: action.payload, loading: 'hide'
      }
    case types.FETCH_DEVICE_FAILURE:
      error = action.payload.data || {
        message: action.payload.message
      }
      return {
        ...state,
        devicesById: [], error: error, loading: 'hide'
      }

    default:
      return state
  }
}
