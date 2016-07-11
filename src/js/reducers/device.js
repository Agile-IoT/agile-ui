import * as types from '../constants/ActionTypes'

const initialState = {
  item: {},
  error: null,
  loading: 'hide'
}

export default function (state = initialState, action) {
  switch (action.type) {

    case types.DEVICE_FETCH_REQUESTED:
      return {
        ...state,
        loading: 'loading'
      }
    case types.DEVICE_FETCH_SUCCEEDED:
      return {
        ...state,
        item: action.data,
        loading: 'hide'
      }
    case types.DEVICE_FETCH_FAILED:
      return {
        ...state,
        item: [],
        error: action.data,
        loading: 'hide'
      }

    default:
      return state
  }
}
