import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as devicesActions from '../../actions/DeviceActions'
import { Device } from '../../components'

class DeviceApp extends Component {

  static propTypes = {
    deviceList: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  render () {
    const { actions } = this.props

    return (
      <div className="col-md-6">
        <h1>Registered Device</h1>
        <Device name='heeey' actions={actions} />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    deviceList: state.deviceList
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(devicesActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeviceApp)
