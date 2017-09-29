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
  streams,
  localStorage,
  cloudUpload,
  records
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
    streams,
    localStorage,
    cloudUpload,
    records
});
