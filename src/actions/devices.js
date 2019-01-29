
// fetch all device
import {action, DEVICE_TYPE, errorHandle, loading, message} from "./index"

export const devicesDelete = deviceId => {
  return (dispatch, getState, agile) => {
    dispatch(loading(true))
    agile.deviceManager
    .delete(deviceId)
    .then(() => {
      dispatch(action('DEVICES_DELETE', deviceId))
      dispatch(message(`Device ${deviceId} deleted.`))
      dispatch(loading(false))
      return agile.idm.entity.delete(deviceId, DEVICE_TYPE)
    })
    .then(() => {
      dispatch(action('DEVICES_DELETE', deviceId))
      dispatch(message(`Device ${deviceId} deleted.`))
      dispatch(loading(false))
    })
    .catch(err => {
      errorHandle(err, dispatch)
    })
  }
}

export const deviceFetch = deviceId => {
  return (dispatch, getState, agile) => {
    dispatch(loading(true))
    agile.deviceManager
    .get(deviceId)
    .then(device => {
      dispatch(action('DEVICE', device))
      if (device.streams) {
        device.streams.map(s => {
          return dispatch(deviceSubscribe(deviceId, s.id))
        })
      }
      dispatch(loading(false))
    })
    .catch(err => {
      errorHandle(err, dispatch)
    })
  }
}

export const devicesDiscover = () => {
  return (dispatch, getState, agile) => {
    agile.protocolManager
    .devices()
    .then(devices => {
      dispatch(action('DEVICES_DISCOVER', devices))
    })
    .catch(err => {
      dispatch(action('DEVICES_DISCOVER', []))
      errorHandle(err, dispatch)
    })
  }
}

export const deviceTypesFetch = deviceOverview => {
  return (dispatch, getState, agile) => {
    agile.deviceManager
    .typeof(deviceOverview)
    .then(deviceTypes => {
      dispatch(
        action('DEVICE_TYPES', {
          id: deviceOverview.id,
          types: deviceTypes
        })
      )
    })
    .catch(err => {
      errorHandle(err, dispatch)
    })
  }
}

export const devicesLoading = bool => {
  return {
    type: 'DEVICES_LOADING',
    data: bool
  }
}

export const streamsFetch = deviceId => {
  return (dispatch, getState, agile) => {
    // dispatch(loading(true))
    agile.device
    .lastUpdate(deviceId)
    .then(streams => {
      dispatch(action('STREAMS', { deviceId, streams }))
      // dispatch(loading(false));
    })
    .catch(err => {
      errorHandle(err, dispatch)
    })
  }
}

// fetch all registered devices and their streams
export const devicesAndStreamsFetch = () => {
  return (dispatch, getState, agile) => {
    dispatch(devicesLoading(true))
    agile.deviceManager
    .get()
    .then(devices => {
      if (devices) {
        const deviceMap = {}
        devices.forEach(d => (deviceMap[d.deviceId] = d))
        dispatch(action('DEVICES', deviceMap))
        devices.forEach(d => dispatch(streamsFetch(d.deviceId)))
      }
      dispatch(devicesLoading(false))
    })
    .catch(err => {
      dispatch(devicesLoading(false))
      dispatch(message(err.message))
    })
  }
}

export const deviceSubscribe = (deviceId, componentId) => {
  return (dispatch, getState, agile) => {
    dispatch(loading(true))
    agile.device
    .subscribe(deviceId, componentId)
    .then(stream => {
      stream.onopen = dispatch(loading(false))
      stream.onerror = errorHandle

      stream.onmessage = e => {
        if (typeof e.data === 'string') {
          const record = JSON.parse(e.data)
          dispatch(action('STREAMS_UPDATE', { record }))
          dispatch(loading(false))
        }
      }
    })
    .catch(err => {
      errorHandle(err, dispatch)
    })
  }
}

export const deviceUnsubscribe = (deviceId, componentId) => {
  return (dispatch, getState, agile) => {
    dispatch(loading(true))
    agile.device
    .unsubscribe(deviceId, componentId)
    .then( () => dispatch(loading(false)))
    .catch(err => {
      errorHandle(err, dispatch)
    })
  }
}

