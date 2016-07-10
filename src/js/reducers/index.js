import { combineReducers } from 'redux'
import deviceList from './deviceList'
import device from './device'
import settings from './settings'

const rootReducer = combineReducers({
  deviceList,
  device,
  settings
})

export default rootReducer
