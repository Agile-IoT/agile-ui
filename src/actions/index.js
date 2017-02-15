import { createRequestTypes, action, asyncActionFactory } from './utils';
import { api } from '../services';
// these function act as trigger functions to run sagas. They should only be called when a user interacts with the page.
// route handling triggers only occur when

//****** ASYNC *****//
// Single device actions
export const device = asyncActionFactory('DEVICE');
// get all devices
export const devices = asyncActionFactory('DEVICES');
export const devicesFetch = () => {
  return (dispatch) => {
        dispatch(devices.request())
        api.devicesFetch()
        .then(res => {
          dispatch(devices.success(res.data));
        })
        .catch(err => {
          dispatch(devices.error(err));
          console.error(err);
        });
    };
}

export const deviceDelete = asyncActionFactory('DEVICE_DELETE');
export const deviceConnect = asyncActionFactory('DEVICE_CONNECT');

// get registered devices devices
export const registeredDevices = asyncActionFactory('REGISTERED_DEVICES');

// trigger a device registration
export const deviceRegister = asyncActionFactory('DEVICE_REGISTER');

// trigger a device registration
export const discoveryToggle = asyncActionFactory('SETTINGS_DISCOVERY_TOGGLE');
export const protocolsFetch = asyncActionFactory('SETTINGS_PROTOCOLS');


//****** SYNC *****//
// SETTINGS_DRAWER_TOGGLE is not async so doesn't need an actions request, success, fail
export const drawerToggle = state => action('SETTINGS_DRAWER_TOGGLE', {state})
// dispatch message to snackBar
export const newMessage = message => action('MESSAGE', {message});
