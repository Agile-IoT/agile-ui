const initialState = []

export default function (state = initialState, action) {
  switch (action.type) {
    case 'MESSAGE':
      let message = action.message
      return [
        ...state,
        message
      ]

    default:
      return state
  }
}
