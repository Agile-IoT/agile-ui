import { delay, takeEvery } from 'redux-saga'
import { call, put, fork, cancelled } from 'redux-saga/effects'
import * as types from '../constants/ActionTypes'
import { requestHandler, redirector } from '../utils'
import { BASE_API } from '../constants/Endpoints'
import { deviceListFetch, deviceCreateDB } from '../actions/deviceList'

function* deviceListPoll(action) {
  try {
    while (true) {
      yield call(requestHandler, action)
      yield call(delay, 2500)
    }
  } finally {
    if (yield cancelled())
      // any clean up actions here
      yield
  }
}

// function* registrationProcessor(action) {
//   // console.log(action)
//   // const { response, error } =  yield call(deviceCreateDB)
//   // if (response)
//   //   yield put({ type: types.DEVICELIST_FETCH_SUCCEEDED , data: response.data })
//   yield call(redirector, '/')
// }
//
function* registerationWatcher() {
  // redirects user from /discovery to device list after successful registration
  // yield takeEvery(types.DEVICE_REGISTER_SUCCEEDED, registrationProcessor)
}

export function* deviceListSaga(route) {
  const action = yield put(deviceListFetch(route))
  yield fork(deviceListPoll, action)
  yield fork(registerationWatcher)
  yield takeEvery([types.DEVICE_DELETE, types.DEVICE_REGISTER], requestHandler)
}
