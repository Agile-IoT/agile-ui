import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as devicesActions from '../../actions/DevicesActions'
import { DeviceList } from '../../components'

class Discover extends Component {

  static propTypes = {
    deviceList: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  render () {
    const { deviceList: { devicesById }, actions } = this.props

    return (
      <div className="col-md-6">
        <h1>Discover</h1>
        <DeviceList devices={devicesById} actions={actions} />
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
)(Discover)
