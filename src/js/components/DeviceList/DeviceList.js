import './DeviceList.scss'

import React, { Component, PropTypes } from 'react'

import DeviceListItem from '../DeviceListItem/DeviceListItem'

export default class DeviceList extends Component {

  static propTypes = {
    devices: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
  };

  renderList() {
    return this.props.devices.map((device) =>
      (
        <DeviceListItem
          key={device.id}
          id={device.id}
          name={device.name}
          starred={device.starred}
          {...this.props.actions} />
      )
    )
  }

  render () {
    return (
      <ul className="DeviceList">
        {this.renderList()}
      </ul>
    )
  }
}
