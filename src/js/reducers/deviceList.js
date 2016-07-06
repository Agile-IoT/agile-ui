/**
 * Another clever approach of writing reducers:
 *
 * export default function(state = initialState, action) {
 *   const actions = {
 *      [ACTION_TYPE]: () => [action.payload.data, ...state]
 *   };
 *
 *   return (_.isFunction(actions[action.type])) ? actions[action.type]() : state
 * }
 */

import * as types from '../constants/ActionTypes'
import { assign } from 'lodash'

const initialState = {
  devices: [0, 1, 2],
  devicesById: [
    {
      id: 0,
      name: '2Pac'
    },
    {
      id: 1,
      name: 'Dr.Dre'
    },
    {
      id: 2,
      name: 'Big Pun'
    }
  ]
}

export default function (state = initialState, action) {
  switch (action.type) {
    case types.ADD_DEVICE: {
      const len = state.devices.length ? state.devices.length : 1
      const newId = (state.devices[len - 1] + 1) || 0
      return {
        ...state,
        devices: state.devices.concat(newId),
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
        devices: state.devices.filter((id) => id !== action.id),
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
