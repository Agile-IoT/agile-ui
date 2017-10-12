import { combineReducers } from 'redux';
import {
  devices,
  currentUser,
  entityList,
  groups,
  input,
  schemas,
  currentTab,
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
  	groups,
    input,
    schemas,
    currentTab,
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
