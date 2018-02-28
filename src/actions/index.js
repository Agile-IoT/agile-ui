/*******************************************************************************
 *Copyright (C) 2017 Resin.io, FBK, Jolocom.
 *All rights reserved. This program and the accompanying materials
 *are made available under the terms of the Eclipse Public License v1.0
 *which accompanies this distribution, and is available at
 *http://www.eclipse.org/legal/epl-v10.html
 *
 *Contributors:
 *    Resin.io, FBK, Jolocom - initial API and implementation
 ******************************************************************************/
import agileSDK from 'agile-sdk';

const agile = agileSDK({
  api: '/agile-core',
  idm: '/agile-security',
  data: '/agile-data'
});

//This sets the token for the calls to the sdk and reloads the SDK object
export const setToken = (newToken) => {
	agile.tokenSet(newToken);
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
      if (devices) {
        const deviceMap = {}
        devices.forEach(d => deviceMap[d.deviceId] = d)
        dispatch(action('DEVICES', deviceMap));
        devices.forEach(d => dispatch(streamsFetch(d.deviceId)));
      }
      dispatch(loading(false))
    })
    .catch(err => {
      errorHandle(err, dispatch)
    });
  };
}

export const fetchEntitySchemas = () => {
  return (dispatch) => {
    dispatch(loading(true))
    agile.idm.entity.getEntitiesSchema()
      .then((schema) => {
        dispatch(action('SCHEMA', schema));
        dispatch(loading(false));
      }).catch(err => {
      errorHandle(err, dispatch)
    });
  }
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
        return Promise.resolve(newDevice);
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

export const updatePassword = (oldPassword, newPassword) => {
  return (dispatch) => {
    dispatch(loading(true))
    agile.idm.user.updatePassword(oldPassword, newPassword)
      .then(entity => {
        dispatch(message(`Password changed.`));
        dispatch(loading(false));
      }).catch(err => {
      errorHandle(err, dispatch)
    });
  };
}

export const resetPassword = (username, authType, newPassword) => {
  return (dispatch) => {
    dispatch(loading(true))
    agile.idm.user.resetPassword(username, authType, newPassword)
      .then(entity => {
        dispatch(message(`Password for ${username} changed.`));
        dispatch(loading(false));
      }).catch(err => {
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

export const setInputName = (name) => {
  return (dispatch) => {
    dispatch(action('INPUT_NAME', name))
  }
}

export const setInputValue = (value) => {
  return (dispatch) => {
    dispatch(action('INPUT_VALUE', value))
  }
}

export const oldPasswordInput = (value) => {
  return (dispatch) => {
    dispatch(action('INPUT_OLD_PASSWORD', value))
  }
}

export const newPasswordInput = (value) => {
  return (dispatch) => {
    dispatch(action('INPUT_NEW_PASSWORD', value))
  }
}

export const canExecuteActions = (id, type, attribute_names, actions) => {
  return (dispatch) => {
    dispatch(loading(true))
    var queryObject = [];
    var actions_seen = [agile];
    actions_seen = actions.map(action => {
      if (actions_seen.indexOf(action) === -1) {
        return action;
      }
      return null;
    });

    attribute_names.push('actions.self'); //Add root object
    if (!attribute_names.includes('password') && type === 'user') {
      attribute_names.push('password'); //Make sure that it is checked whether the current user can set the password
    }
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

export const recommendationsFetch = () => {
  return (dispatch) => {
    dispatch(loading(true))

    const protocol = document.location.protocol || 'http:'
    const host = document.location.hostname
    const apiEndpoint = `${protocol}//${host}:8090/recommenderdockerservice`

    window.fetch(`${apiEndpoint}/getDeviceRecommendation`)
    .then(r => r.json())
    .then(data => {
      dispatch(loading(false))
      dispatch(action('RECOMMENDATIONS', data.deviceList))
    }).catch(err => {
      dispatch(loading(false))
      errorHandle(err, dispatch)
    })
  }
}

export const currentTab = (type) => {
  return (dispatch) => {
    dispatch(loading(true))
    dispatch(action('CURRENT_TAB', type));
    dispatch(loading(false));
  };
}

export const entityFetch = (type) => {
  return (dispatch) => {
		dispatch(loading(true))
		if (type === 'group') {
			agile.idm.group.get()
			.then(entities => {
				dispatch(action('ENTITIES', entities));
				dispatch(loading(false));
			})
			.catch(err => {
				errorHandle(err, dispatch)
			})
		} else {
			agile.idm.entity.getByType(type)
			.then(entities => {
				dispatch(action('ENTITIES', entities));
				dispatch(loading(false));
			})
			.catch(err => {
				errorHandle(err, dispatch)
			});
		}
	}
}

// fetch all groups
export const groupsFetch = () => {
  return (dispatch) => {
    dispatch(loading(true))
    agile.idm.group.get()
      .then(groups => {
        dispatch(action('GROUPS', groups));
        dispatch(loading(false));
      })
      .catch(err => {
        errorHandle(err, dispatch)
      });
  };
}

export const addToGroup = (owner, name, type, id) => {
  return (dispatch) => {
    dispatch(loading(true))
    agile.idm.group.addEntity({owner: owner, name: name, entityType: type, entityId: id})
      .then(entity => {
        dispatch(action('ENTITY_ADDED_GROUP', entity));
        dispatch(message(`User added to group ${name}.`));
        dispatch(loading(false));
      }).catch(err => {
      errorHandle(err, dispatch)
    });
  };
}

export const removeFromGroup = (owner, name, type, id) => {
  return (dispatch) => {
    dispatch(loading(true))
    agile.idm.group.removeEntity({owner: owner, name: name, entityType: type, entityId: id})
      .then(entity => {
        dispatch(action('ENTITY_REMOVED_GROUP', entity));
        dispatch(message(`User removed from group ${name}.`));
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
        dispatch(message(`User ${userName} deleted.`));
        dispatch(loading(false));
      })
      .catch(err => {
        errorHandle(err, dispatch)
      });
  };
}

export const groupDelete = (owner, name) => {
  return (dispatch) => {
    dispatch(loading(true))
    agile.idm.group.delete(owner, name)
      .then(() => {
        dispatch(action('GROUP_DELETE', name));
        dispatch(message(`Group ${name} deleted.`));
        dispatch(loading(false));
      })
      .catch(err => {
        errorHandle(err, dispatch)
      });
  };
}

export const entityDelete = (entityId, entityType) => {
  return (dispatch) => {
    dispatch(loading(true))
    agile.idm.entity.delete(entityId, entityType)
      .then(() => {
        dispatch(action('ENTITY_DELETE', entityId));
        dispatch(message(`Entity ${entityId} deleted.`));
        dispatch(loading(false));
      })
      .catch(err => {
        errorHandle(err, dispatch)
      });
  }
}

export const entityDeleteByType = (entity, type) => {
  switch(type) {
    case 'user':
      return usersDelete(entity.user_name, entity.auth_type);
    case 'group':
      return groupDelete(entity.owner, entity.group_name);
    default:
      return entityDelete(entity.id, type)
  }
}

export const usersCreate = (user, authType, options) => {
  return (dispatch) => {
    dispatch(loading(true))
    agile.idm.user.create(user, authType, options)
      .then((newUser) => {
        dispatch(action('USERS_CREATE', newUser));
        dispatch(message(`User ${user} created.`));
        dispatch(loading(false));
      })
      .catch(err => {
        errorHandle(err, dispatch)
      });
  };
}

export const groupCreate = (group_name) => {
  return (dispatch) => {
    dispatch(loading(true))
    agile.idm.group.create(group_name)
      .then((newGroup) => {
        dispatch(action('GROUP_CREATE', newGroup));
        dispatch(message(`Group ${group_name} created.`));
        dispatch(loading(false));
      })
      .catch(err => {
        errorHandle(err, dispatch)
      });
  };
}

export const entityCreate = (entity, type) => {
  return (dispatch) => {
    dispatch(loading(true))
    agile.idm.entity.create(entity.id, type, entity).then(entity => {
      dispatch(action('ENTITY_CREATE', entity));
      dispatch(message(`Entity ${entity.name} created.`));
      dispatch(loading(false));
    }).catch(err => {
      errorHandle(err, dispatch)
    });
  }
}


export const entityCreateByType = (data, type) => {
  switch(type) {
    case 'user':
      return usersCreate(data.user_name, data.auth_type, data);
    case 'group':
      return groupCreate(data.group_name);
    default:
      return entityCreate(data, type);
  }
}

export const fetchLocks = () => {
  return (dispatch) => {
    dispatch(loading(true))
    agile.idm.entity.getEntitiesSchema()
    .then((schemas) => {
      dispatch(action('LOCK_FORMATS', schemas.ui.locks));
      dispatch(loading(false));
    }).catch(err => {
      errorHandle(err, dispatch)
    });
  }
}

export const fetchEntityLocks = (entity_id, entity_type, field) => {
  return (dispatch) => {
    dispatch(loading(true));
    agile.policies.pap.get({entityId: entity_id, entityType: entity_type, field: field}).then(locks => {
      dispatch(action('ENTITY_FIELD_LOCKS', locks.result));
      dispatch(loading(false));
    });
  }
}

export const setLock = (params) => {
  return (dispatch) => {
    dispatch(loading(true));
    agile.policies.pap.set(params).then(result => {
      dispatch(action('POLICY_SET', result.result));
      dispatch(message(`Successfully set policy of ${params.entityId} for '${params.field}'.`));
      dispatch(loading(false));
    })
  }
}

export const deleteLock = (params) => {
  return (dispatch) => {
    dispatch(loading(true));
    agile.policies.pap.delete(params).then(result => {
      dispatch(action('POLICY_DELETE', result.result));
      dispatch(loading(false));
    })
  }
}

export const formSelected = (formNames) => {
  return (dispatch) => {dispatch(action('FORM_SELECTED', formNames))}
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
    if (currentState().discovery) {
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
export const locStorPolicyAdd = (deviceID, componentID, interval, retention) => {
  return (dispatch, currentState) => {
    dispatch(loading(true))
    agile.data.subscription.create({
      deviceID,
      componentID,
      interval,
      retention: retention + "d"
    })
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
