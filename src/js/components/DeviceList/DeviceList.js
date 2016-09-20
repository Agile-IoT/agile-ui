import React, { Component, PropTypes } from 'react'
import DeviceListItem from '../DeviceListItem/DeviceListItem'

export default class DeviceList extends Component {

  static propTypes = {
    devices: PropTypes.object.isRequired,
  };

  renderList(devices) {
    return Object.keys(devices).map((deviceId) =>
      (
        <DeviceListItem
          key={deviceId}
          id={deviceId}
          name={devices[deviceId].name}
          address={deviceId}
          protocol={devices[deviceId].protocol}
          device={devices[deviceId]}
          actions={this.props.actions} />
      )
    )
  }

  render () {
    return (
      <div>
        <ul className="DeviceList">
          {this.renderList(this.props.devices)}
        </ul>
      </div>

    )
  }
}
