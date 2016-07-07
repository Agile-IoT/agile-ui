import * as types from '../constants/ActionTypes'
import { assign } from 'lodash'

const initialState = {
  devicesById: [],
  error: null,
  loading: 'hide'
}

export default function (state = initialState, action) {
  let error

  switch (action.type) {

    case types.FETCH_DEVICES:
    // start fetching posts and set loading = true
      return {
        ...state,
        loading: 'loading'
      }
    case types.FETCH_DEVICES_SUCCESS:// return list of posts and make loading = false
      return {
        ...state,
        devicesById: action.payload, loading: 'hide'
      }
    case types.FETCH_DEVICES_FAILURE:// return error and make loading = false
      error = action.payload.data || {
        message: action.payload.message
      } //2nd one is network or server down errors
      return {
        ...state,
        devicesById: [], error: error, loading: 'hide'
      }

    case types.ADD_DEVICE: {
      const len = state.devices.length ? state.devices.length : 1
      const newId = (state.devices[len - 1] + 1) || 0
      return {
        ...state,
        devicesById: [
          ...state.devicesById,
          {
            id: newId,
            name: action.name
          }
        ]
      }
    }

    case types.DELETE_DEVICE:
      return {
        ...state,
        devicesById: state.devicesById.filter((device) => device.id !== action.id)
      }

    case types.STAR_DEVICE:
      return {
        ...state,
        devicesById: state.devicesById.map((device) => {
          if (device.id !== action.id) {
            return device
          }

          return assign({}, device, {
            starred: !device.starred
          })
        })
      }

    default:
      return state
  }
}
