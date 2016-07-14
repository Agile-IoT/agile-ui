import { delay, takeEvery } from 'redux-saga'
import { call, put, fork, cancelled } from 'redux-saga/effects'
import * as types from '../constants/ActionTypes'
import { requester, deviceCRUD, redirector } from '../utils'
import { BASE_API } from '../constants/Endpoints'
import { deviceListFetch } from '../actions/deviceList'

function* deviceListPoll(action) {
  try {
    while (true) {
      const { response, error } = yield call(requester, action.method, action.url)
      if (response)
        yield put({ type: types.DEVICELIST_FETCH_SUCCEEDED , data: response.data })
      else
        yield put({ type: types.DEVICELIST_FETCH_FAILED , data: error })
      // delay poll
      yield call(delay, 2500)
    }
  } finally {
    if (yield cancelled())
      // any clean up actions here
      yield
  }
}

function* registerationWatcher() {
  // redirects user from /discovery to device list after successful registration
  yield takeEvery(types.DEVICE_REGISTER_SUCCEEDED, redirector, '/')
}

export function* deviceListSaga(route) {
  // hack - the function below this should emit this action
  yield put({type: types.DEVICELIST_FETCH})
  // hack - the function below this should emit this action
  const action = yield call(deviceListFetch, route)
  yield fork(deviceListPoll, action)
  yield fork(registerationWatcher)
  yield takeEvery([types.DEVICE_DELETE, types.DEVICE_REGISTER], deviceCRUD)
}
