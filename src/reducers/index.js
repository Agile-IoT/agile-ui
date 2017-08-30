import { combineReducers } from 'redux';
import {
  devices,
  currentUser,
  entityList,
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
