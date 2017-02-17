import agileSDK from 'agile-sdk';
const agile = agileSDK('/api');

//****** UTILS ******//
const action = (type, data) => {
  return {type, data}
}

export const loading = bool => {
  return {
    type: 'LOADING',
    data: bool
  };
}

export const message = msg => {
  return {
    type: 'MESSAGE',
    data: msg
  };
}

export const errorHandle = (err, dispatch) => {
  dispatch(message(err.message));
  dispatch(loading(false));
}
//****** ASYNC *****//
// fetch all unregistered devices
export const devicesDiscover = () => {
  return (dispatch) => {
    dispatch(loading(true))
    agile.protocolManager.devices()
    .then(devices => {
      dispatch(action('DEVICES_DISCOVER', devices));
      dispatch(loading(false));
    })
    .catch(err => {
      errorHandle(err, dispatch)
    });
  };
}

export const deviceSubscribe = (deviceId, componentID) => {
  return (dispatch, currentState) => {
    if (currentState.discovery) {
      agile.device.subscribe(deviceId, componentID)
      .then((stream) => {
        stream.onerror = () => {
          dispatch(message('Socket Connection Error'))
        };

        stream.onopen = () => {
          dispatch(message('Socket Connected'))
        };

        stream.onclose = () => {
          dispatch(message('Socket Closed'))
        };

        stream.onmessage = (e) => {
          if (typeof e.data === 'string') {
            console.log("Received: '" + e.data + "'");
            dispatch(action('WS', {
              deviceId,
              componentID,
              payload:e.data
            }))
          }
        };
        dispatch(loading(false));
      }).catch(err => {
        errorHandle(err, dispatch)
      });
    } else {
      agile.protocolManager.discovery.start()
      .then(() => {
        dispatch(action('DISCOVERY', true));
        dispatch(message('Discovery on.'));
        dispatch(loading(false));
      }).catch(err => {
        errorHandle(err, dispatch)
      });
    }
  }
}

export const deviceTypesFetch = () => {
  return (dispatch) => {
    dispatch(loading(true))
    dispatch(action('DEVICE_TYPES', ['TI SensorTag']));
    dispatch(loading(false));
    // agile.deviceManager.typeof()
    // .then(deviceTypes => {
    //
    // })
    // .catch(err => {
    //   errorHandle(err, dispatch)
    // });
  };
}

// fetch all registered devices
export const devicesFetch = () => {
  return (dispatch) => {
    dispatch(loading(true))
    agile.deviceManager.getAll()
    .then(devices => {
      dispatch(action('DEVICES', devices));
      dispatch(loading(false));
    })
    .catch(err => {
      errorHandle(err, dispatch)
    });
  };
}

export const devicesDelete = (deviceId) => {
  return (dispatch) => {
    dispatch(loading(true))
    agile.deviceManager.delete(deviceId)
    .then(() => {
      dispatch(action('DEVICES_DELETE', deviceId));
      dispatch(loading(false));
    })
    .catch(err => {
      errorHandle(err, dispatch)
    });
  };
}

export const devicesCreate = (device, type) => {
  return (dispatch) => {
    dispatch(loading(true))
    agile.deviceManager.create(device, type)
    .then((newDevice) => {
      dispatch(action('DEVICES_CREATE', newDevice));
      dispatch(loading(false));
    })
    .catch(err => {
      errorHandle(err, dispatch)
    });
  };
}

// fetch all available protocols
export const protocolsFetch = () => {
  return (dispatch) => {
    dispatch(loading(true))
    agile.protocolManager.get()
    .then(protocols => {
      dispatch(action('PROTOCOLS', protocols));
      dispatch(loading(false));
      dispatch(devicesDiscover());
    })
    .catch(err => {
      errorHandle(err, dispatch)
    });
  };
}

export const drawerToggle = bool => action('DRAWER', bool);

export const discoveryStatus = () => {
  return (dispatch) => {
    agile.protocolManager.discovery.status()
    .then(status => {
      dispatch(action('DISCOVERY', status));
      dispatch(message(`discover is ${status}`));
      dispatch(loading(false));
    }).catch(err => {
      errorHandle(err, dispatch)
    });
  }
}

export const discoveryToggle = () => {
  return (dispatch, currentState) => {
    if (currentState.discovery) {
      agile.protocolManager.discovery.stop()
      .then(() => {
        dispatch(action('DISCOVERY', false));
        dispatch(message('Discovery off.'));
        dispatch(loading(false));
      }).catch(err => {
        errorHandle(err, dispatch)
      });
    } else {
      agile.protocolManager.discovery.start()
      .then(() => {
        dispatch(action('DISCOVERY', true));
        dispatch(message('Discovery on.'));
        dispatch(loading(false));
      }).catch(err => {
        errorHandle(err, dispatch)
      });
    }
  }
}
