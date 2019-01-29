import {action, errorHandle, loading, message} from "./index"

export const startDiscovery = () => {
  return (dispatch, getState, agile) => {
    dispatch(loading(true))
    agile.protocolManager.discovery
    .start()
    .then(() => {
      dispatch(action('DISCOVERY', true))
      dispatch(loading(false))
    })
    .catch(err => {
      errorHandle(err, dispatch)
    })
  }
}

export const discoveryToggle = () => {
  return (dispatch, currentState, agile) => {
    if (currentState().discovery) {
      agile.protocolManager.discovery
      .stop()
      .then(() => {
        dispatch(action('DISCOVERY', false))
        dispatch(message('Discovery off.'))
        dispatch(loading(false))
      })
      .catch(err => {
        errorHandle(err, dispatch)
      })
    } else {
      agile.protocolManager.discovery
      .start()
      .then(() => {
        dispatch(action('DISCOVERY', true))
        dispatch(message('Discovery on.'))
        dispatch(loading(false))
      })
      .catch(err => {
        errorHandle(err, dispatch)
      })
    }
  }
}

export const discoveryStatus = () => {
  return (dispatch, getState, agile) => {
    agile.protocolManager.discovery
    .status()
    .then(protocols => {
      protocols.map(protocols => {
        return dispatch(message(`${protocols.name} is ${protocols.status}`))
      })
      dispatch(loading(false))
    })
    .catch(err => {
      errorHandle(err, dispatch)
    })
  }
}
