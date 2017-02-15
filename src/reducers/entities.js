export function devices(state = [], action) {
  switch (action.type) {
    case 'DEVICES':
      return action.data;
    default:
      return state;
  }
}

export function messages(state = [], action) {
  switch (action.type) {
    case 'MESSAGE':
      return action.data;
    default:
      return state;
  }
}

export function loading(state = false, action) {
  switch (action.type) {
    case 'MESSAGE':
      return action.data;
    default:
      return state;
  }
}
