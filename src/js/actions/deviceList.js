// Any deviceList view triggers go here
import { createRequestTypes, asyncActionFactory } from './utils'

// get registered devices devices
export const registeredDevices = asyncActionFactory('REGISTERED_DEVICES')
// get all devices
export const devices = asyncActionFactory('DEVICES')
// trigger a device registration
export const deviceRegister = asyncActionFactory('DEVICE_REGISTER')
