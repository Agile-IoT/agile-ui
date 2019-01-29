/*******************************************************************************
 *Copyright (C) 2017 Resin.io, FBK, Jolocom.
 *All rights reserved. This program and the accompanying materials
 *are made available under the terms of the Eclipse Public License 2.0
 *which accompanies this distribution, and is available at
 *https://www.eclipse.org/legal/epl-2.0/
 *
 *SPDX-License-Identifier: EPL-2.0
 *
 *Contributors:
 *    Resin.io, FBK, Jolocom - initial API and implementation
 ******************************************************************************/

export const action = (type, data) => {
  return { type, data }
}

export const DEVICE_TYPE = 'device'

export const entityLoading = bool => {
  return {
    type: 'ENTITY_LOADING',
    data: bool
  }
}

export const showConfirmScreen = (message, onConfirm) => {
  return {
    type: 'CONFIRMATION_SHOW',
    data: {
      render: true,
      message,
      onConfirm
    }
  }
}

export const hideConfirmationScreen = () => {
  return {
    type: 'CONFIRMATION_HIDE'
  }
}

export const loading = bool => {
  return {
    type: 'LOADING',
    data: bool
  }
}

export const message = msg => {
  return {
    type: 'MESSAGE',
    data: msg
  }
}

export const messageRemove = msg => {
  return {
    type: 'MESSAGE_REMOVE',
    data: msg
  }
}

export const errorHandle = (err, dispatch) => {
  console.log(err, dispatch)
  dispatch(message(err.message))
  dispatch(loading(false))
}

export const fetchEntitySchemas = () => {
  return (dispatch, _, agile) => {
    dispatch(loading(true))
    agile.idm.entity
      .getEntitiesSchema()
      .then(schema => {
        dispatch(action('SCHEMA', schema))
        dispatch(loading(false))
      })
      .catch(err => {
        errorHandle(err, dispatch)
      })
  }
}
export const devicesCreate = (device, type) => {
  return (dispatch, _, agile) => {
    var newDevice
    dispatch(loading(true))
    agile.deviceManager
      .create(device, type)
      .then(d => {
        newDevice = d
        return agile.idm.entity.get(d.deviceId, DEVICE_TYPE)
      })
      .then(entity => {
        return Promise.resolve(newDevice)
      })
      .catch(err => {
        var entity = { name: newDevice.name, credentials: {} }
        return agile.idm.entity.create(newDevice.deviceId, DEVICE_TYPE, entity)
      })
      .then(entity => {
        dispatch(action('DEVICES_CREATE', newDevice))
        dispatch(loading(false))
      })
      .catch(err => {
        errorHandle({ err: 'entity already exists' }, dispatch)
      })
  }
}

export const fetchCurrentUserCredentials = () => {
  return async (dispatch, getState, agile) => {
    const userInfo = await agile.idm.user.getCurrentUserInfo()
    const { credentials } = await agile.idm.entity.get(userInfo.id, 'user')
    dispatch(action('CREDENTIALS', credentials))
  }
}

export const fetchCurrentUser = () => {
  return (dispatch, getState, agile) => {
    dispatch(loading(true))
    agile.idm.user
      .getCurrentUserInfo()
      .then(user => {
        dispatch(action('CURRENT_USER', user))
        dispatch(loading(false))
      })
      .catch(err => {
        errorHandle(err, dispatch)
      })
  }
}

export const updatePassword = (oldPassword, newPassword) => {
  return (dispatch, getState, agile) => {
    dispatch(loading(true))
    agile.idm.user
      .updatePassword(oldPassword, newPassword)
      .then(entity => {
        dispatch(message(`Password changed.`))
        dispatch(loading(false))
      })
      .catch(err => {
        errorHandle(err, dispatch)
      })
  }
}

export const resetPassword = (username, authType, newPassword) => {
  return (dispatch, getState, agile) => {
    dispatch(loading(true))
    agile.idm.user
      .resetPassword(username, authType, newPassword)
      .then(entity => {
        dispatch(message(`Password for ${username} changed.`))
        dispatch(loading(false))
      })
      .catch(err => {
        errorHandle(err, dispatch)
      })
  }
}

export const setEntityData = params => {
  return (dispatch, getState, agile) => {
    dispatch(loading(true))
    agile.idm.entity
      .setAttribute(params)
      .then(entity => {
        dispatch(action('ENTITY_ATTRIBUTE_SET', entity))
        dispatch(message('Record Set'))
        dispatch(loading(false))
      })
      .catch(err => {
        errorHandle(err, dispatch)
      })
  }
}

export const deleteAttribute = params => {
  return (dispatch, getState, agile) => {
    dispatch(loading(true))
    agile.idm.entity
      .deleteAttribute(params.id, params.type, params.attribute)
      .then(entity => {
        dispatch(action('ENTITY_ATTRIBUTE_SET', entity))
        dispatch(loading(false))
      })
      .catch(err => {
        errorHandle(err, dispatch)
      })
  }
}

export const setInputName = name => {
  return dispatch => {
    dispatch(action('INPUT_NAME', name))
  }
}

export const setInputValue = value => {
  return dispatch => {
    dispatch(action('INPUT_VALUE', value))
  }
}

export const oldPasswordInput = value => {
  return dispatch => {
    dispatch(action('INPUT_OLD_PASSWORD', value))
  }
}

export const newPasswordInput = value => {
  return dispatch => {
    dispatch(action('INPUT_NEW_PASSWORD', value))
  }
}

export const canExecuteActions = (id, type, attribute_names, actions) => {
  return (dispatch, getState, agile) => {
    dispatch(loading(true))
    var queryObject = []
    var actions_seen = [agile]
    actions_seen = actions.map(action => {
      if (actions_seen.indexOf(action) === -1) {
        return action
      }
      return null
    })

    attribute_names.push('actions.self') //Add root object
    if (!attribute_names.includes('password') && type === 'user') {
      attribute_names.push('password') //Make sure that it is checked whether the current user can set the password
    }
    attribute_names.forEach(attribute => {
      actions_seen.forEach(method => {
        queryObject.push({
          entityId: id,
          entityType: type.startsWith('/') ? type : '/' + type,
          method: method,
          field: attribute
        })
      })
    })

    agile.policies.pdp.evaluate(queryObject).then(results => {
      var result_list = { id: id, type: type, policies: {} }
      var i = 0
      attribute_names.forEach(attribute => {
        actions_seen.forEach(act => {
          if (!result_list.policies[attribute]) {
            result_list.policies[attribute] = {}
          }
          result_list.policies[attribute][act] = results[i++]
        })
      })
      dispatch(action('ENTITY_POLICIES', result_list))
      dispatch(loading(false))
    })
  }
}

export const entityFetch = type => {
  return (dispatch, getState, agile)  => {
    dispatch(entityLoading(true))
    if (type === 'group') {
      agile.idm.group
        .get()
        .then(entities => {
          dispatch(action('ENTITIES', entities))
          dispatch(entityLoading(false))
        })
        .catch(err => {
          errorHandle(err, dispatch)
        })
    } else {
      agile.idm.entity
        .getByType(type)
        .then(entities => {
          dispatch(action('ENTITIES', entities))
          dispatch(entityLoading(false))
        })
        .catch(err => {
          errorHandle(err, dispatch)
        })
    }
  }
}

export const groupsFetch = () => {
  return (dispatch, getState, agile) => {
    dispatch(loading(true))
    agile.idm.group
      .get()
      .then(groups => {
        dispatch(action('GROUPS', groups))
        dispatch(loading(false))
      })
      .catch(err => {
        errorHandle(err, dispatch)
      })
  }
}

export const addToGroup = (owner, name, type, id) => {
  return (dispatch, getStte, agile) => {
    dispatch(loading(true))
    agile.idm.group
      .addEntity({ owner: owner, name: name, entityType: type, entityId: id })
      .then(entity => {
        dispatch(action('ENTITY_ADDED_GROUP', entity))
        dispatch(message(`User added to group ${name}.`))
        dispatch(loading(false))
      })
      .catch(err => {
        errorHandle(err, dispatch)
      })
  }
}

export const removeFromGroup = (owner, name, type, id) => {
  return (dispatch, getState, agile) => {
    dispatch(loading(true))
    agile.idm.group
      .removeEntity({
        owner: owner,
        name: name,
        entityType: type,
        entityId: id
      })
      .then(entity => {
        dispatch(action('ENTITY_REMOVED_GROUP', entity))
        dispatch(message(`User removed from group ${name}.`))
        dispatch(loading(false))
      })
      .catch(err => {
        errorHandle(err, dispatch)
      })
  }
}

export const usersDelete = (userName, auth_type) => {
  return (dispatch, getState, agile) => {
    dispatch(loading(true))
    agile.idm.user
      .delete(userName, auth_type)
      .then(() => {
        dispatch(action('ENTITY_DELETE', userName))
        dispatch(message(`User ${userName} deleted.`))
        dispatch(loading(false))
      })
      .catch(err => {
        errorHandle(err, dispatch)
      })
  }
}

export const groupDelete = (owner, name) => {
  return (dispatch, getState, agile) => {
    dispatch(loading(true))
    agile.idm.group
      .delete(owner, name)
      .then(() => {
        dispatch(action('GROUP_DELETE', { group_name: name, owner: owner }))
        dispatch(message(`Group ${name} | ${owner} deleted.`))
        dispatch(loading(false))
      })
      .catch(err => {
        errorHandle(err, dispatch)
      })
  }
}

export const entityDelete = (entityId, entityType) => {
  return (dispatch, getState, agile) => {
    dispatch(loading(true))
    agile.idm.entity
      .delete(entityId, entityType)
      .then(() => {
        dispatch(action('ENTITY_DELETE', entityId))
        dispatch(message(`Entity ${entityId} deleted.`))
        dispatch(loading(false))
      })
      .catch(err => {
        errorHandle(err, dispatch)
      })
  }
}

export const entityDeleteByType = (entity, type) => {
  switch (type) {
    case 'user':
      return usersDelete(entity.user_name, entity.auth_type)
    case 'group':
      return groupDelete(entity.owner, entity.group_name)
    default:
      return entityDelete(entity.id, type)
  }
}

export const usersCreate = (user, authType, options) => {
  return (dispatch, getState, agile) => {
    dispatch(loading(true))
    agile.idm.user
      .create(user, authType, options)
      .then(newUser => {
        dispatch(action('USERS_CREATE', newUser))
        dispatch(message(`User ${user} created.`))
        dispatch(loading(false))
      })
      .catch(err => {
        errorHandle(err, dispatch)
      })
  }
}

export const groupCreate = group_name => {
  return (dispatch, getState, agile) => {
    dispatch(loading(true))
    agile.idm.group
      .create(group_name)
      .then(newGroup => {
        dispatch(action('GROUP_CREATE', newGroup))
        dispatch(message(`Group ${group_name} created.`))
        dispatch(loading(false))
      })
      .catch(err => {
        errorHandle(err, dispatch)
      })
  }
}

export const entityCreate = (entity, type) => {
  return (dispatch, getState, agile) => {
    dispatch(loading(true))
    agile.idm.entity
      .create(entity.id, type, entity)
      .then(entity => {
        dispatch(action('ENTITY_CREATE', entity))
        dispatch(message(`Entity ${entity.name} created.`))
        dispatch(loading(false))
      })
      .catch(err => {
        errorHandle(err, dispatch)
      })
  }
}

export const entityCreateByType = (data, type) => {
  switch (type) {
    case 'user':
      return usersCreate(data.user_name, data.auth_type, data)
    case 'group':
      return groupCreate(data.group_name)
    default:
      return entityCreate(data, type)
  }
}

export const fetchLocks = () => {
  return (dispatch, getState, agile) => {
    dispatch(loading(true))
    agile.idm.entity
      .getEntitiesSchema()
      .then(schemas => {
        dispatch(action('LOCK_FORMATS', schemas.ui.locks))
        dispatch(loading(false))
      })
      .catch(err => {
        errorHandle(err, dispatch)
      })
  }
}

export const addLockField = params => {
  return dispatch => {
    dispatch(loading(true))
    switch (params.type.toUpperCase()) {
      case 'WRITE':
        dispatch(action('ADD_WRITE_LOCK_FIELD', params))
        break
      case 'READ':
        dispatch(action('ADD_READ_LOCK_FIELD', params))
        break
      default:
        break
    }
    dispatch(loading(false))
  }
}

export const removeLockField = params => {
  return dispatch => {
    dispatch(loading(true))
    switch (params.type.toUpperCase()) {
      case 'WRITE':
        dispatch(action('REMOVE_WRITE_LOCK_FIELD', params))
        break
      case 'READ':
        dispatch(action('REMOVE_READ_LOCK_FIELD', params))
        break
      default:
        break
    }
    dispatch(loading(false))
  }
}

export const fetchEntityLocks = (entity_id, entity_type, field) => {
  return (dispatch, getState, agile) => {
    dispatch(loading(true))
    agile.policies.pap.get({ entityId: entity_id, entityType: entity_type, field: field }).then(locks => {
      dispatch(action('ENTITY_FIELD_LOCKS', locks.result))
      dispatch(loading(false))
    })
  }
}

export const setLock = params => {
  //Make sure no delete buttons are there and avoid errors with references
  const policies = [].concat(
    params.policy.map(p => {
      const pKeys = Object.keys(p)
      let newPolicy = {}
      pKeys.forEach(key => {
        if (key !== 'deleteButton') {
          newPolicy[key] = p[key]
        }
      })

      newPolicy.locks = newPolicy.locks.map(l => {
        const keys = Object.keys(l)
        let newLock = {}
        keys.forEach(key => {
          if (key !== 'deleteButton') {
            newLock[key] = l[key]
          }
        })
        return newLock
      })

      return newPolicy
    })
  )
  const par = Object.assign({}, params, { policy: policies })

  return (dispatch, getState, agile) => {
    dispatch(loading(true))
    agile.policies.pap.set(par).then(result => {
      dispatch(action('POLICY_SET', result.result))
      dispatch(message(`Successfully set policy of ${params.entityId} for '${params.field}'.`))
      dispatch(loading(false))
    })
  }
}

export const deleteLock = params => {
  return (dispatch, getState, agile) => {
    dispatch(loading(true))
    agile.policies.pap.delete(params).then(result => {
      dispatch(action('POLICY_DELETE', result.result))
      dispatch(loading(false))
    })
  }
}

export const formSelected = (type, policy, formNames) => {
  return dispatch => {
    dispatch(action('FORM_SELECTED', { type: type, policy: policy, formNames: formNames }))
  }
}

export const drawerToggle = bool => action('DRAWER', bool)

