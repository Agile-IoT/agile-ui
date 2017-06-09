//It seems that with the latest SDK there is a problem with the device type now... so we include two for now...
import agileSDK from 'agile-sdk';

var token = 'non-existing';

var agile = agileSDK({
  api:'http://agilegw.local:8080',
  idm:'http://agilegw.local:3000'

});
const DEVICE_TYPE = "device";

//This sets the token for the calls to the sdk and reloads the SDK object
export const setToken = (new_token) => {
  token=new_token;
  console.log("creating new sdk with token starting wih "+token.substring(0,20))
  agile = agileSDK({
    api:'http://agilegw.local:8080',
    idm:'http://agilegw.local:3000',
    token: token
  });

  //re-create agile
}
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

export const deviceTypesFetch = (deviceOverview) => {
  return (dispatch) => {
    dispatch(loading(true))
    agile.deviceManager.typeof(deviceOverview)
    .then(deviceTypes => {
      dispatch(action('DEVICE_TYPES', deviceTypes));
      dispatch(loading(false));
    })
    .catch(err => {
      errorHandle(err, dispatch)
    });
  };
}

export const deviceSubscribe = (deviceId, componentId) => {
  return (dispatch) => {
    dispatch(loading(true))
    agile.device.subscribe(deviceId, componentId)
    .then(devices => {
      dispatch(loading(false));
    })
    .catch(err => {
      errorHandle(err, dispatch)
    });
  };
}

export const deviceUnsubscribe = (deviceId, componentId) => {
  return (dispatch) => {
    dispatch(loading(true))
    agile.device.unsubscribe(deviceId, componentId)
    .then(devices => {
      dispatch(loading(false));
    })
    .catch(err => {
      errorHandle(err, dispatch)
    });
  };
}

// fetch all device
export const deviceFetch = (deviceId) => {
  return (dispatch) => {
    dispatch(loading(true))
    agile.deviceManager.get(deviceId)
    .then(device => {
      dispatch(action('DEVICE', device));
      if (device.streams) {
        device.streams.map((s) => {
          dispatch(deviceSubscribe(deviceId, s.id))
        })
      }
      dispatch(loading(false));
    })
    .catch(err => {
      errorHandle(err, dispatch)
    });
  };
}

export const streamsFetch = (deviceId) => {
  return (dispatch) => {
    dispatch(loading(true))
    agile.device.lastUpdate(deviceId)
    .then(streams => {
      dispatch(action('STREAMS', {deviceId, streams}));
      dispatch(loading(false));
    })
    .catch(err => {
      errorHandle(err, dispatch)
    });
  };
}

// fetch all registered devices
export const devicesFetch = () => {
  return (dispatch) => {
    dispatch(loading(true))
    agile.deviceManager.get()
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
      return agile.idm.entity.delete(deviceId, DEVICE_TYPE);
    })
    .then(() => {
      dispatch(action('DEVICES_DELETE', deviceId));
      dispatch(message(`Device ${deviceId} deleted.`));
      dispatch(loading(false));
    })
    .catch(err => {
      errorHandle(err, dispatch)
    });
  };
}

export const devicesCreate = (device, type) => {
  return (dispatch) => {
    var newDevice;
    dispatch(loading(true))
    agile.deviceManager.create(device, type)
    .then((d) => {
      newDevice = d;
      return agile.idm.entity.get(d.deviceId, DEVICE_TYPE);
    })
    .then((entity) => {
      return Promise.resolve(entity);
    })
    .catch(err => {
      var entity = {name:newDevice.name, credentials:{}};
      return agile.idm.entity.create(newDevice.deviceId, DEVICE_TYPE, entity);
    })
    .then(entity => {
      dispatch(action('DEVICES_CREATE', newDevice));
      dispatch(loading(false));
    })
    .catch(err => {
      console.log("entity seems to be there already...");
      dispatch(loading(false));
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


export const credentialsFetch = (deviceId) => {
  return (dispatch) => {
    dispatch(loading(true))
    agile.idm.entity.get(deviceId,DEVICE_TYPE)
    .then(device => {
      dispatch(action('CREDENTIALS', device));
      dispatch(loading(false));
    })
    .catch(err => {
      errorHandle(err, dispatch)
    });
  };
}

export const setDeviceAttribute = (deviceId, attribute, value) => {
  return (dispatch) => {
    dispatch(loading(true))
    agile.idm.entity.setAttribute({
      entity_id:deviceId,
      entity_type: DEVICE_TYPE,
      attribute_type: attribute,
      attribute_value: value
    })
    .then(device => {
      dispatch(action('CREDENTIALS_CREATE', device));
      dispatch(loading(false));
    })
    .catch(err => {
      errorHandle(err, dispatch)
    });
  };
}
