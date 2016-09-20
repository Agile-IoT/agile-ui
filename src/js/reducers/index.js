import { combineReducers } from 'redux'
import messages from './messages'
import entities from './entities'
import { routerReducer } from 'react-router-redux'

const rootReducer = combineReducers({
  routing: routerReducer,
  entities,
  messages
})

export default rootReducer
