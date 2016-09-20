import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Device, NoResults, Loading } from '../../components'
import { bindActionCreators } from 'redux'
import { deviceDelete, deviceGafanaLink } from '../../actions/device'

class DeviceApp extends Component {

  static propTypes = {
    device: PropTypes.object,
    actions: PropTypes.array.isRequired
  }

  render () {
    const { device , actions } = this.props
    if (!device) {
      return (<Loading />)
    } else if (device && device.error) {
      return (<NoResults text='No device found'/>)
    } else {
      return (<Device
        device={device}
        actions={actions}
        />)
    }
  }
}

function mapStateToProps(state) {
  // get device from cachedDevices
  let deviceId = state.routing.locationBeforeTransitions.pathname
  return {
    device: state.entities.registeredDevices[deviceId.split("/").pop()]
  }
}

function mapDispatchToProps(dispatch) {
  let actions = [{
    text: 'Delete',
    func:  bindActionCreators(deviceDelete.request, dispatch)
  },{
    text: 'View Data',
    func:  bindActionCreators(deviceGafanaLink, dispatch)
  }]
  return {
    actions: actions
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeviceApp)
