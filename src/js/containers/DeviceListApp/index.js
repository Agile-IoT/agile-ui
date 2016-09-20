import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { DeviceList, NoResults, Loading } from '../../components'
import { bindActionCreators } from 'redux'
import { deviceRegister } from '../../actions/deviceList'
import { isEmpty } from 'lodash'

class DeviceListApp extends Component {
  static propTypes = {
    deviceList: PropTypes.object.isRequired,
    actions: PropTypes.array.isRequired,
    route: PropTypes.object.isRequired
  }

  render () {
    const { deviceList, actions, route } = this.props
    if (isEmpty(deviceList)) {
      return (<Loading />)
    } else if (deviceList.length < 1) {
      return (<NoResults text='No devices found'/>)
    } else {
      return (<DeviceList listName={route.title} devices={deviceList} actions={actions} />)
    }
  }
}

function mapStateToProps(state) {
  return {
    deviceList: state.entities.devices
  }
}

function mapDispatchToProps(dispatch, props) {
  let actions = [{
    text: 'Register',
    func:  bindActionCreators(deviceRegister.request, dispatch)
  }]
  return {
    actions: actions
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeviceListApp)
