import {action, errorHandle, message} from "./index"

export const cloudUploadData = ({ selectedProvider, data, customArgs }) => {
  return async (dispatch, getState, agile) => {
    const { deviceId, componentId, startDate, endDate } = data

    const startStamp = new Date(startDate).getTime()
    const endStamp = new Date(endDate).getTime()

    const query = {
      deviceID: deviceId,
      componentID: componentId,
      between: `${startStamp}|${endStamp}`
    }

    return agile.cloud
    .exportDataToCloud(selectedProvider, query, customArgs)
    .then(() => dispatch(message('Uploaded')))
    .catch(err => {
      errorHandle(err, dispatch)
      dispatch(message(err.response.data))
    })
  }
}

export const fetchCloudProviders = () => {
  return async (dispatch, getState, agile) => {
    try {
      const res = await agile.cloud.getCloudsInfo()
      const supportedClouds = res.clouds.filter(c => c.implemented)

      const providersDetails = await Promise.all(
        supportedClouds.map(c =>
          agile.cloud
          .getCloudInfo(c.endpoint)
          .then(description => Object.assign({}, description, { displayName: c.displayName }))
        )
      )

      dispatch(action('CLOUD_PROVIDERS', providersDetails))
    } catch (err) {
      errorHandle(err, dispatch)
    }
  }
}

