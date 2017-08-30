import agileSDK from 'agile-sdk';


var agile = agileSDK({
  api: 'http://agile-core:8080',
  idm: 'http://agile-security:3000'
});

//This sets the token for the calls to the sdk and reloads the SDK object

export const setToken = (new_token) => {
  var token = new_token;
  console.log('creating new sdk with token starting wih ' + token.substring(0, 20))
  agile = agileSDK({
    api: 'http://agile-core:8080',
    idm: 'http://agile-security:3000',
    token: token
  });
}

//****** UTILS ******//
const action = (type, data) => {
  return {type, data}
}

const DEVICE_TYPE = 'device';

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
      return agile.idm.entity.delete(deviceId, DEVICE_TYPE);
    }).then(() => {
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
        console.log('entity seems to be there already...');
        dispatch(loading(false));
      });
  };
}

// fetch all curent user data
export const fetchCurrentUser = () => {
  return (dispatch) => {
    dispatch(loading(true))
    agile.idm.user.getCurrentUserInfo()
      .then(user => {
        dispatch(action('CURRENT_USER', user));
        dispatch(loading(false));
      })
      .catch(err => {
        errorHandle(err, dispatch)
      });
  };
}

export const userFetch = (id) => {
  return (dispatch) => {
    dispatch(loading(true))
    agile.idm.entity.get(id, 'user')
      .then(user => {
        dispatch(action('USER', user));
        dispatch(loading(false));
      })
      .catch(err => {
        errorHandle(err, dispatch)
      });
  };
}

export const setPassword = (params) => {
  return (dispatch) => {
    dispatch(loading(true))
    agile.idm.entity.setAttribute(params) // TODO set password through user in stack
      .then(entity => {
        dispatch(action('ENTITY_ATTRIBUTE_SET', entity));
        dispatch(loading(false));
      })
      .catch(err => {
        errorHandle(err, dispatch)
      });
  };
}

export const setEntityData = (params) => {
  return (dispatch) => {
    dispatch(loading(true))
    agile.idm.entity.setAttribute(params)
      .then(entity => {
        dispatch(action('ENTITY_ATTRIBUTE_SET', entity));
        dispatch(loading(false));
      })
      .catch(err => {
        errorHandle(err, dispatch)
      });
  };
}

export const deleteAttribute = (params) => {
  return (dispatch) => {
    dispatch(loading(true))
    agile.idm.entity.deleteAttribute(params.id, params.type, params.attribute)
      .then(entity => {
        dispatch(action('ENTITY_ATTRIBUTE_SET', entity));
        dispatch(loading(false));
      })
      .catch(err => {
        errorHandle(err, dispatch)
      });
  };
}

export const canExecuteActions = (id, type, attribute_names, actions) => {
  return (dispatch) => {
    dispatch(loading(true))
    var queryObject = [];
    var actions_seen = [];
    for (var act in actions) {
      if (actions.hasOwnProperty(act) && actions_seen.indexOf(act) === -1) {
        actions_seen.push(act);
      }
    }
    attribute_names.push('actions.self'); //Add root object
    attribute_names.forEach(attribute => {
      actions_seen.forEach(method => {
        queryObject.push({entityId: id, entityType: type.startsWith('/') ? type : '/' + type, method: method, field: attribute});
      });
    });

    agile.policies.pdp.evaluate(queryObject).then(
      results => {
        var result_list = {id: id, type: type, policies: {}};
        var i = 0;
        attribute_names.forEach(attribute => {
          actions_seen.forEach(act => {
            if (!result_list.policies[attribute]) {
              result_list.policies[attribute] = {};
            }
            result_list.policies[attribute][act] = results[i++];
          });
        });
        dispatch(action('ENTITY_POLICIES', result_list));
        dispatch(loading(false))
      })
  }
}

// fetch all users
export const entityFetch = (type) => {
  return (dispatch) => {
    dispatch(loading(true))
    agile.idm.entity.getByType(type)
      .then(entities => {
        dispatch(action('ENTITIES', entities));
        dispatch(loading(false));
      })
      .catch(err => {
        errorHandle(err, dispatch)
      });
  };
}

export const usersDelete = (userName, auth_type) => {
  return (dispatch) => {
    dispatch(loading(true))
    agile.idm.user.delete(userName, auth_type)
      .then(() => {
        dispatch(action('ENTITY_DELETE', userName));
        dispatch(message(`User ${`userName`} deleted.`));
        dispatch(loading(false));
      })
      .catch(err => {
        errorHandle(err, dispatch)
      });
  };
}

export const usersCreate = (user, type) => {
  return (dispatch) => {
    dispatch(loading(true))
    agile.idm.user.create(user, type)
      .then((newUser) => {
        dispatch(action('USERS_CREATE', newUser));
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
