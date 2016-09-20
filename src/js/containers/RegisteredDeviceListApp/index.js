import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { DeviceList, NoResults, Loading } from '../../components'
import { isEmpty } from 'lodash'

class RegisteredDeviceListApp extends Component {
  static propTypes = {
    deviceList: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired,
    actions: PropTypes.array.isRequired
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
    deviceList: state.entities.registeredDevices
  }
}

function mapDispatchToProps(dispatch, props) {
  return {
    actions: []
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisteredDeviceListApp)
