import sortBy from 'lodash/sortBy';
import omit from 'lodash/omit';

export function devices(state = {}, action) {
  switch (action.type) {
    case 'DEVICE':
      return {
        ...state,
        [action.data.deviceId] : action.data
      }
    case 'DEVICES':
      return action.data;
    case 'DEVICES_DELETE':
      return omit(state, action.data)
    case 'DEVICES_CREATE':
      return {
        ...state,
        [action.data.deviceId] : action.data
      }

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

export function currentUser(state = {}, action) {
  switch (action.type) {
    case 'CURRENT_USER':
      return action.data;
    default:
      return state;
  }
}

export function entityPolicies(state = {}, action) {
  switch (action.type) {
    case 'ENTITY_POLICIES':
      return action.data;
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

export function entityList(state = [], action) {
  switch (action.type) {
    case 'ENTITIES':
      return action.data;
    case 'ENTITY_DELETE':
      return state.filter(element => element.user_name ? element.user_name !== action.data : element.name !== action.data);
    case 'GROUP_DELETE':
      return state.filter(element => element.group_name !== action.data);
    case 'ENTITY_ADDED_GROUP':
    case 'ENTITY_REMOVED_GROUP':
    case 'ENTITY_ATTRIBUTE_SET':
      return state.map(entity => {
        if (entity.id === action.data.id && entity.type === action.data.type) {
          entity = action.data;
        }
        return entity;
      });
    default:
      return state;
  }
}

export function policies(state = {}, action) {
  switch(action.type) {
    case 'ENTITY_FIELD_LOCKS':
      return action.data;
    case 'POLICY_DELETE':
      return action.data;
    case 'POLICY_SET':
      return action.data;
    default:
      return state;
  }
}

export function lockFormats(state = {}, action) {
  switch(action.type) {
    case 'LOCK_FORMATS':
      return action.data;
    default:
      return state;
  }
}

export function form(state = [], action) {
  switch(action.type) {
    case 'FORM_SELECTED':
      return action.data;
    default:
      return state;
  }
}

export function groups(state = [], action) {
  switch (action.type) {
    case 'GROUPS':
      return action.data;
    default:
      return state;
  }
}

export function input(state = {}, action) {
  switch (action.type) {
    case 'INPUT_NAME':
      state.input_name = action.data;
      return state;
    case 'INPUT_VALUE':
      state.input_value = action.data;
      return state;
    case 'INPUT_OLD_PASSWORD':
      state.old_password = action.data;
      return state;
    case 'INPUT_NEW_PASSWORD':
      state.new_password = action.data;
      return state;
    default:
      return state;
  }
}

export function schemas(state = {}, action) {
  switch (action.type) {
    case 'SCHEMA':
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


export function messages(state = [], action) {
  switch (action.type) {
    case 'MESSAGE':
      return [
        action.data,
        ...state
      ]
    case 'MESSAGE_REMOVE':
      let newState = state.filter((i) => i !== action.data)
      return newState
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
      return action.data;
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

export function deviceTypes(state = {}, action) {
  switch (action.type) {
    case 'DEVICE_TYPES':
      if (action.data.types.length > 0) {
        return {
          ...state,
          [action.data.id]: action.data.types
        };
      }
      return state
    default:
      return state;
  }
}

export function records(state = {}, action) {
  switch (action.type) {
    case 'DEVICE_RECORDS':
      const { deviceId } = action.data
      return {
        ...state,
        [deviceId]: action.data.records
      }
    default:
      return state
  }
}

export function streams(state = [], action) {
  switch (action.type) {
    case 'STREAMS':
      const { deviceId } = action.data
      return {
        ...state,
        [deviceId]: sortBy(action.data.streams, 'componentID')
      }
    default:
      return state;
  }
}
