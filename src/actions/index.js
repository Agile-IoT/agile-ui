import { api } from '../services';

//****** UTILS ******//
const action = (type, data = {}) => {
  return {type, ...data}
}

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

//****** ASYNC *****//

// fetch all unregistered devices
export const devicesFetch = () => {
  return (dispatch) => {
        dispatch(loading)
        api.devicesFetch()
        .then(res => {
          dispatch(action('DEVICES', res.data));
        })
        .catch(err => {
          dispatch(message(err.message));
          console.error(err);
        });
    };
}

export const deviceDelete = action('DEVICE_DELETE');
export const deviceConnect = action('DEVICE_CONNECT');

// get registered devices devices
export const registeredDevices = action('REGISTERED_DEVICES');

// trigger a device registration
export const deviceRegister = action('DEVICE_REGISTER');

// trigger a device registration
export const discoveryToggle = action('SETTINGS_DISCOVERY_TOGGLE');
export const protocolsFetch = action('SETTINGS_PROTOCOLS');


//****** SYNC *****//
// SETTINGS_DRAWER_TOGGLE is not async so doesn't need an actions request, success, fail
export const drawerToggle = state => action('SETTINGS_DRAWER_TOGGLE', {state})
