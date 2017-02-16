export function devices(state = [], action) {
  switch (action.type) {
    case 'DEVICES':
      return action.data;
    case 'DEVICES_DELETE':
      console.log('DEVICEID', action.data)
      return state.filter(element => element.deviceId !== action.data);
    case 'DEVICES_CREATE':
      return [
        action.data,
        ...state
      ]
    default:
      return state;
  }
}

export function devicesDiscover(state = [], action) {
  switch (action.type) {
    case 'DEVICES_DISCOVER':
      return action.data;
    case 'DEVICES_CREATE':
      return state.filter(element => element.name !== action.data.name);
    default:
      return state;
  }
}


export function messages(state=[], action) {
  switch (action.type) {
    case 'MESSAGE':
      return [
        action.data,
        ...state
      ]
    default:
      return state;
  }
}

export function loading(state = false, action) {
  switch (action.type) {
    case 'LOADING':
      return action.data;
    default:
      return state;
  }
}

export function discovery(state = false, action) {
  switch (action.type) {
    case 'DISCOVERY':
      return state;
    default:
      return state;
  }
}

export function drawer(state = false, action) {
  switch (action.type) {
    case 'DRAWER':
      return !state;
    default:
      return state;
  }
}

export function protocols(state = [], action) {
  switch (action.type) {
    case 'PROTOCOLS':
      return action.data;
    default:
      return state;
  }
}

export function deviceTypes(state = [], action) {
  switch (action.type) {
    case 'DEVICE_TYPES':
      return action.data;
    default:
      return state;
  }
}
