const REQUEST = 'REQUEST'
const SUCCESS = 'SUCCESS'
const FAILURE = 'FAILURE'

// Create actions eg. DEVICE_REQUEST, DEVICE_SUCCESS, DEVICE_FAIL
export function createRequestTypes(base) {
  return [REQUEST, SUCCESS, FAILURE].reduce((acc, type) => {
		acc[type] = `${base}_${type}`
		return acc
	}, {})
}

// Create action functions for async actions eg request(), success(), fail()
export function asyncActionFactory(actionName) {
  let actions = createRequestTypes(actionName)
  return {
    request: data => action(actions[REQUEST], {data}),
    success: data => action(actions[SUCCESS], {data}),
    failure: error => action(actions[FAILURE], {error}),
  }
}

export function action(type, data = {}) {
  return {type, ...data}
}
