import { BASE_API } from '../constants/Endpoints'
import { createRequestTypes, asyncActionFactory } from './utils'

// trigger a device registration
export const discoveryToggle = asyncActionFactory('SETTINGS_DISCOVERY_TOGGLE')
export const protocolsFetch = asyncActionFactory('SETTINGS_PROTOCOLS')

// SETTINGS_DRAWER_TOGGLE is not async so doesn't need an actions request, success, fail
export function drawerToggle(state) {
  return {
    type: 'SETTINGS_DRAWER_TOGGLE',
    state: state
  }
}
