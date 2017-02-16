import protocolManager from './protocolManager';
import deviceManager from './deviceManager';
export const api = (base) => {
  return ({
    protocolManager: protocolManager(base),
    deviceManager: deviceManager(base),
  })
}

export default api
