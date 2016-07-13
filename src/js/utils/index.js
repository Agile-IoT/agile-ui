import axios from 'axios'
import { BASE_API } from '../constants/Endpoints'
import { browserHistory } from 'react-router'
import { call, put } from 'redux-saga/effects'

export function requester(method, resource, body) {
  return axios({
    method: method,
    url: BASE_API + resource,
    headers: [],
    data: body
  })
  .then(response => ({ response }))
  .catch(error => ({ error }))
}

export function* deviceCRUD(action) {
  const { response, error } = yield call(requester, action.method, `${action.resource}`, action.body)
  if (response)
    yield put({ type: `${action.type}_SUCCEEDED` , data: response.data })
  else
    yield put({ type: `${action.type}_FAILED` , data: error })
}

export function redirector(route) {
  browserHistory.push(route)
  return
}
