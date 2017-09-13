import { combineReducers } from 'redux';
import {
  devices,
  currentUser,
  entityList,
  input,
  entityPolicies,
  devicesDiscover,
  messages,
  loading,
  discovery,
  drawer,
  protocols,
  deviceTypes,
  streams
} from './entities';

export default combineReducers({
    devices,
    entityList,
    input,
    entityPolicies,
    currentUser,
    devicesDiscover,
    messages,
    loading,
    discovery,
    drawer,
    protocols,
    deviceTypes,
    streams
});
