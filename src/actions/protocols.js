import {loading} from "../reducers/entities"
import {devicesDiscover} from "./devices"
import {action, errorHandle} from "./index"

export const protocolsFetch = () => async (dispatch, getState, agile) => {
  try {
    dispatch(loading(true))
    const protocols = await agile.protocolManager.get()
    const withConfig = await Promise.all(
      protocols.map(async protocol => {
        try {
          const configuration = await agile.protocolManager.configuration.get(protocol.dbusInterface)
          return { ...protocol, configuration }
        } catch (err) {
          return { ...protocol, configuration: [] }
        }
      })
    )

    dispatch(action('PROTOCOLS', withConfig))
    dispatch(loading(false))
    dispatch(devicesDiscover())
  } catch (err) {
    errorHandle(err, dispatch)
  }
}

export const protcolConfigSet = (protocolId, configuration) => async (dispatch, getState, agile) => {
  try {
    dispatch(loading(true))
    await agile.protocolManager.configuration.set(protocolId, configuration)
    dispatch(loading(false))
    dispatch(protocolsFetch())
  } catch (err) {
    errorHandle(err, dispatch)
  }
}
