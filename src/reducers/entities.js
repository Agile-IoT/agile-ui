import includes from 'lodash/includes';
import sortBy from 'lodash/sortBy';

export function devices(state = [], action) {
  switch (action.type) {
    case 'DEVICES':
      return action.data;
    case 'DEVICES_DELETE':
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

export function cloudUpload(state = {}, action) {
  switch (action.type) {
    case 'DEVICE_ID':
      return Object.assign({}, state, {deviceId: action.data})
    case 'COMPOENT_ID':
      return Object.assign({}, state, {componentId: action.data})
    case 'START_DATE':
      return Object.assign({}, state, {startDate: action.data})
    case 'END_DATE':
      return Object.assign({}, state, {endDate: action.data})
    case 'PROVIDER':
      return Object.assign({}, state, {provider: action.data})
    default:
      return state;
  }
}

export function localStorage(state = {}, action) {
  switch (action.type) {
    case 'LOC_DEVICE_ID':
      return Object.assign({}, state, {deviceId: action.data})
    case 'LOC_COMPOENT_ID':
      return Object.assign({}, state, {componentId: action.data})
    case 'INTERVAL':
      return Object.assign({}, state, {interval: action.data})
    case 'POLICIES':
      return action.data;
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
      if (action.data.length > 0 && !includes(state, action.data[0])) {
        return [
          ...state,
          ...action.data
        ];
      }
      return state
    default:
      return state;
  }
}

export function device(state = {}, action) {
  switch (action.type) {
    case 'DEVICE':
      return action.data
    case 'DEVICES_DELETE':
      if (state.deviceId === action.data) {
        return {}
      }
      return state;
    default:
      return state;
  }
}

export function records(state = [], action) {
  switch (action.type) {
    case 'DEVICE_RECORDS':
      return action.data
    default:
      return state
  }
}

export function streams(state = [], action) {
  switch (action.type) {
    case 'STREAMS':
      const deviceId = action.data.deviceId
      return {
        ...state,
        [deviceId]: sortBy(action.data.streams, 'componentID')
      }
    default:
      return state;
  }
}
