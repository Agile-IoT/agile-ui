import * as types from '../constants/ActionTypes'
import { assign } from 'lodash'

const initialState = {
  items: [],
  error: null,
  loading: 'hide'
}

export default function (state = initialState, action) {
  let error

  switch (action.type) {

    case types.DEVICELIST_FETCH:
    // start fetching posts and set loading = true
      return {
        ...state,
        loading: 'loading'
      }
    case types.DEVICELIST_FETCH_SUCCESS:// return list of posts and make loading = false
      return {
        ...state,
        items: action.payload, loading: 'hide'
      }
    case types.DEVICELIST_FETCH_FAILURE:// return error and make loading = false
      error = action.payload.data || {
        message: action.payload.message
      } //2nd one is network or server down errors
      return {
        ...state,
        items: [], error: error, loading: 'hide'
      }

    default:
      return state
  }
}