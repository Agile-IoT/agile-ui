import * as types from '../constants/ActionTypes'

export function deviceListFetch(route) {
  return {
    type: types.DEVICELIST_FETCH,
    route: route
  }
}
