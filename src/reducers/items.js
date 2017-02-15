export function devices(state = [], action) {
    switch (action.type) {
        case 'DEVICES_SUCCESS':
            return action.data;
        default:
            return state;
    }
}
