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
    request: result => action(actions[REQUEST], {result}),
    success: (result, response) => action(actions[SUCCESS], {result, response}),
    failure: (result, error) => action(actions[FAILURE], {result, error}),
  }
}

export function action(type, payload = {}) {
  return {type, ...payload}
}
