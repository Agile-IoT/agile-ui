import * as types from '../constants/ActionTypes'

export function addDevice(name) {
  return {
    type: types.ADD_DEVICE,
    name
  }
}

export function deleteDevice(id) {
  return {
    type: types.DELETE_DEVICE,
    id
  }
}

export function starDevice(id) {
  return {
    type: types.STAR_DEVICE,
    id
  }
}
