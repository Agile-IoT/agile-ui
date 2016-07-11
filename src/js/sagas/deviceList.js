import { delay } from 'redux-saga'
import { call, put, fork, cancelled } from 'redux-saga/effects'
import * as types from '../constants/ActionTypes'
import { requester } from '../utils'

function* deviceListPoll(route) {
  try {
    while (true) {
      let resource
      if (route === '/') {
        resource = '/devices'
      } else {
        resource = '/protocols/devices'
      }

      const { response, error } = yield call(requester, 'GET', resource)

      if (response)
        yield put({ type: types.DEVICELIST_FETCH_SUCCEEDED , data: response.data })
      else
        yield put({ type: types.DEVICELIST_FETCH_FAILED , data: error })
      // delay poll
      yield call(delay, 2000)
    }
  } finally {
    if (yield cancelled())
      yield console.log('deviceList saga cancelled')
  }
}

export function* deviceListSaga(route) {
  yield put({ type: types.DEVICELIST_FETCH })
  const poller = yield fork(deviceListPoll, route)
}
