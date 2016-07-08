import { combineReducers } from 'redux'
import deviceList from './deviceList'
import settings from './settings'

const rootReducer = combineReducers({
  deviceList,
  settings
})

export default rootReducer
