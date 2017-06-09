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
  device,
  streams,
  credentials
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
    device,
    streams,
    credentials
});
