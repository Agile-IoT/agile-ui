import { combineReducers } from 'redux';
import { devices, messages } from './entities';

export default combineReducers({
    devices,
    messages,
});
