import {action, errorHandle, hideConfirmationScreen, loading, showConfirmScreen, message} from "./index"

export const locStorPolicyAdd = ({ deviceID, componentID, interval, retention, publicKey }) => {
  return (dispatch, getState, agile) => {
    dispatch(loading(true))

    interval = interval ? interval : 3000
    retention = retention ? retention : 7

    const creationArgs = {
      deviceID,
      componentID,
      interval,
      retention: retention + 'd'
    }

    if (publicKey) {
      creationArgs.encrypt = {
        key: publicKey,
        fields: ['value']
      }
    }

    const existingRecords = getState().records[deviceID][componentID]

    const shouldEncrypt = !!publicKey
    const existingRecordsEncrypted = !!existingRecords.length && existingRecords[0][1] !== existingRecords[0][1]

    if (existingRecords.length && shouldEncrypt !== existingRecordsEncrypted) {
      const msg =
        `Local ${existingRecordsEncrypted ? 'encrypted' : 'unencrypted'} ` +
        'records have been found. The new subscription policy ' +
        'has a different encryption setting. If you continue, ' +
        'records created by the previous subscription will be deleted.'

      return dispatch(
        showConfirmScreen(msg, async () => {
          const query = `deviceID=${deviceID}&componentID=${componentID}`
          await agile.data.record.delete(query)
          await agile.data.subscription.create(creationArgs)
          dispatch(locStorPoliciesFetch(deviceID))
          dispatch(loading(false))
          dispatch(hideConfirmationScreen())
        })
      )
    } else {
      agile.data.subscription
      .create(creationArgs)
      .then(() => {
        dispatch(locStorPoliciesFetch(deviceID))
        dispatch(loading(false))
      })
      .catch(err => {
        errorHandle(err, dispatch)
      })
    }
  }
}

export const locStorPolicyDelete = (deviceID, componentID) => {
  return (dispatch, getState, agile) => {
    dispatch(loading(true))
    const query = `deviceID=${deviceID}&componentID=${componentID}`
    agile.data.subscription.get(query).then(subscriptions => {
      subscriptions.forEach(subscription => {
        agile.data.subscription
        .delete(subscription._id)
        .then(() => {
          dispatch(loading(false))
          dispatch(message('Subscription deleted.'))
          dispatch(locStorPoliciesFetch(deviceID))
        })
        .catch(err => {
          errorHandle(err, dispatch)
        })
      })
    })
  }
}

export const locStorPoliciesFetch = deviceID => {
  return (dispatch, getState, agile) => {
    dispatch(loading(true))
    const query = `deviceID=${deviceID}`
    agile.data.subscription
    .get(query)
    .then(policies => {
      dispatch(action('POLICIES', { deviceID, policies }))
      dispatch(loading(false))
    })
    .catch(err => {
      errorHandle(err, dispatch)
    })
  }
}

// TODO Enforce min args
export const recordsFetch = (deviceId, componentId) => {
  return (dispatch, getState, agile) => {
    let query = `deviceID=${deviceId}`

    if (componentId) {
      query += `&componentID=${componentId}`
    }

    dispatch(loading(true))
    agile.data.record
    .get(query)
    .then(records => {
      dispatch(action('DEVICE_RECORDS', { deviceId, componentId, records }))
      dispatch(loading(false))
    })
    .catch(err => {
      err.message = `Connecting to Agile Data : ${err.message}`
      errorHandle(err, dispatch)
    })
  }
}

export const recordsDelete = (deviceId, componentId) => {
  return (dispatch, getState, agile) => {
    dispatch(loading(true))
    const query = `deviceID=${deviceId}&componentID=${componentId}`
    return agile.data.record
    .delete(query)
    .then(() => {
      dispatch(recordsFetch(deviceId, componentId))
      dispatch(loading(false))
    })
    .catch(err => {
      errorHandle(err, dispatch)
    })
  }
}
