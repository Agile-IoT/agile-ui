import {action, errorHandle} from "./index"

export const recommenderLoading = bool => {
  return {
    type: 'RECOMMENDER_LOADING',
    data: bool
  }
}

export const recommendationsFetch = () => {
  return dispatch => {
    dispatch(recommenderLoading(true))

    const protocol = document.location.protocol || 'http:'
    const host = document.location.hostname
    const apiEndpoint = `${protocol}//${host}:8090/recommenderdockerservice`

    window
    .fetch(`${apiEndpoint}/getDeviceRecommendation`)
    .then(r => r.json())
    .then(data => {
      dispatch(action('RECOMMENDATIONS', data.deviceList))
      dispatch(recommenderLoading(false))
    })
    .catch(err => {
      dispatch(action('RECOMMENDATIONS', []))
      dispatch(recommenderLoading(false))
      errorHandle(err, dispatch)
    })
  }
}

