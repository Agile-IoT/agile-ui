import { combineReducers } from 'redux';
import {
  devices,
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
