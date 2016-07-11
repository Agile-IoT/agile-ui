import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { DeviceList } from '../../components'
import { bindActionCreators } from 'redux'
import * as deviceListActions from '../../actions/deviceList'

class DeviceListApp extends Component {
  static propTypes = {
    deviceList: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)
  }

  render () {
    const { deviceList: { items, loading }, actions, route } = this.props
    return (
      <div>
        <DeviceList listName={route.title} loading={loading} devices={items} actions={actions} />
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
    actions: bindActionCreators(deviceListActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeviceListApp)
