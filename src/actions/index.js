var agile = require('agile-sdk') ({
  api: 'http://agile.local:8080',
  data: 'http://127.0.0.1:1338'
})

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

export const messageRemove = msg => {
  return {
    type: 'MESSAGE_REMOVE',
    data: msg
  };
}

export const errorHandle = (err, dispatch) => {
  dispatch(message(err.message));
  dispatch(loading(false));
}

// Local storage related.
export const setInterval = (interval) => {
  return (dispatch) => {
    dispatch(action('INTERVAL', interval))
  }
}

export const setLocDeviceId = (deviceId) => {
  return (dispatch) => {
    dispatch(action('LOC_DEVICE_ID', deviceId))
  }
}

export const setLocComponentId = (componentId) => {
  return (dispatch) => {
    dispatch(action('LOC_COMPONENT_ID', componentId))
  }
}

// Cloud upload related

//
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
      dispatch(
        action('DEVICE_TYPES', {
          id: deviceOverview.id,
          types: deviceTypes
        })
      );
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
          return dispatch(deviceSubscribe(deviceId, s.id))
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

// fetch all registered devices and their streams
export const devicesAndStreamsFetch = () => {
  return (dispatch) => {
    dispatch(loading(true))
    agile.deviceManager.get()
    .then(devices => {
      const deviceMap = {}

      devices.forEach(d => deviceMap[d.deviceId] = d)

      dispatch(action('DEVICES', deviceMap));
      dispatch(loading(false));
      devices.forEach(d => dispatch(streamsFetch(d.deviceId)));
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
      dispatch(message(`Device ${`deviceId`} deleted.`));
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
    .then(protocols => {
      dispatch(action('DISCOVERY', protocols[0]));
      protocols.map((protocols) => {
        return dispatch(message(`${protocols.name} is ${protocols.status}`));
      })
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

// TODO EXPIREMENTAL
export const locStorPolicyAdd = (deviceID, componentID, interval) => {
  return (dispatch, currentState) => {
    dispatch(loading(true))
    agile.data.subscription.create({deviceID, componentID, interval})
    .then(() => {
      dispatch(locStorPoliciesFetch(deviceID))
      dispatch(loading(false));
    })
    .catch(err => {
      errorHandle(err, dispatch)
    })
  }
}

export const locStorPolicyDelete = (deviceID, componentID) => {
  return (dispatch, currentState) => {
    dispatch(loading(true))
    agile.data.subscription.get().then(subscriptions => {
      const matching = subscriptions
        .find(sub => sub.deviceID === deviceID && sub.componentID === componentID)

      if (!matching)
        errorHandle({msg: 'Could not remove subscription'}, dispatch)

      agile.data.subscription.delete(matching._id).then(() => {
        dispatch(loading(false))
        dispatch(message('Subscription deleted.'));
        dispatch(locStorPoliciesFetch(deviceID))
      }).catch(err => {
        errorHandle(err, dispatch)
      })
    })
  }
}

// TODO Policies per device ID / Component ID do not work atm.
export const locStorPoliciesFetch = (deviceID) => {
  return (dispatch, currentState) => {
    dispatch(loading(true))
    agile.data.subscription.get()
    .then(policies => {
      dispatch(loading(false))
      dispatch(action('POLICIES', policies));
    })
    .catch(err => {
      errorHandle(err, dispatch)
    })
  }
}

export const recordsFetch = (deviceId, componentId) => {
  return(dispatch) => {
    const query = `where={
      "deviceID": "${deviceId}",
      "componentID": "${componentId}"
    }`

    dispatch(loading(true))
    agile.data.record.get(query).then(records => {
      dispatch(loading(false))
      dispatch(action('DEVICE_RECORDS', {deviceId, records}))
    }).catch(err => {
      err.message = `Connecting to Agile Data : ${err.message}`
      errorHandle(err, dispatch)
    })
  }
}

export const cloudUploadData = (deviceID, componentID, startDate, endDate, provider) => {
  // TODO Workaround, will go away once we provide the user with a way to select precise time.
  const query = `where={"deviceID": "${deviceID}", "componentID": "${componentID}"}`
  startDate.setHours(0, 0)
  endDate.setHours(23, 59)
  return (dispatch) => {
    dispatch(loading(true))
    agile.data.record.get(query)
    .then(entries => {
      // TODO this is a workaround, ideally should be able to query the DB directly.
      const relevant = entries.filter(entry => {
        let entryDate = new Date(entry.time)
        const tooEarly = entryDate < startDate
        const tooLate = entryDate > endDate
        return !tooEarly && !tooLate
      })

      return relevant
    }).then(data => {
      dispatch(loading(false))
      alert(`${data.length} entries are ready for upload to ${provider}`)
    }).catch(err => {
      errorHandle(err, dispatch)
    })
  }
}
