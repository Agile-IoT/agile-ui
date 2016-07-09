import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as devicesActions from '../../actions/DeviceListActions'
import { DeviceList } from '../../components'

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

  componentDidMount () {
    this.updateList(this.props)
  }

  componentWillUpdate (nextProps) {
    // detect if route has changed and load new device resource
    if (nextProps.location.pathname != this.props.location.pathname) {
      this.updateList(nextProps)
    }
  }

  updateList(props) {
    let resource
    if (props.location.pathname === '/') {
      resource = '/devices'
    } else {
      resource = '/protocols/devices'
    }

    this.props.actions.fetchDeviceList(resource).payload.then((response) => {
      !response.error ? this.props.actions.fetchDeviceListSuccess(response.data) : this.props.actions.fetchDeviceList(response.payload)
    })
  }

  render () {
    const { deviceList: { items, loading }, actions, route } = this.props
    return (
      <div className="col-md-6">
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

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(devicesActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeviceListApp)