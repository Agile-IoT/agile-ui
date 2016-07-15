import axios from 'axios'
import { BASE_API } from '../constants/Endpoints'
import { browserHistory } from 'react-router'
import { call, put } from 'redux-saga/effects'
import * as types from '../constants/ActionTypes'

export function requester(method, resource, body) {
  return axios({
    method: method,
    url: resource,
    headers: [],
    data: body
  })
  .then(response => ({ response }))
  .catch(error => ({ error }))
}

export function* requestHandler(action) {
  const { response, error } = yield call(requester, action.method, action.url, action.body)
  if (response) {
    yield put({ type: `${action.type}_SUCCEEDED` , data: response.data, prevAction: action })
    if (action.confirm) {
      yield put({ type: types.CONFIRMATIONS_ADD ,  data: response, prevAction: action })
    }
  } else {
    yield put({ type: `${action.type}_FAILED` , data: error, prevAction: action })
    yield put({ type: types.ERRORS_ADD , data: error, prevAction: action })
  }
}

export function redirector(route) {
  browserHistory.push(route)
  return
}
