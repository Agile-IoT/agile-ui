import { browserHistory } from 'react-router'
import { call, put } from 'redux-saga/effects'

// resuable fetch Subroutine
// entity :  device | device | starred | stargazers
// apiFn  : api.fetchUser | api.fetchRepo | ...
// id     : login | fullName
// url    : next page url. If not provided will use pass it to apiFn
export function* fetchEntity(entity, apiFn, id) {
  yield put( entity.request(id || null) )
  const {response, error} = yield call(apiFn, id)
  if(response)
    yield put( entity.success(id, response) )
  else
    yield put( entity.failure(id, error) )
}

export function redirector(route) {
  browserHistory.push(route)
  return
}
