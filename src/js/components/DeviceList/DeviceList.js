import './DeviceList.scss'

import React, { Component, PropTypes } from 'react'

import DeviceListItem from '../DeviceListItem/DeviceListItem'
import RefreshIndicator from 'material-ui/RefreshIndicator'

export default class DeviceList extends Component {

  static propTypes = {
    devices: PropTypes.array.isRequired
  };

  renderList() {
    return this.props.devices.map((device) =>
      (
        <DeviceListItem
          key={device.id}
          id={device.id}
          name={device.name}
          path={device.path}
          starred={device.starred}
          {...this.props.actions} />
      )
    )
  }

  render () {
    return (
      <div>
        <RefreshIndicator
          size={50}
          left={70}
          top={0}
          status={this.props.loading}
          loadingColor={"#FF9800"}
        />
        <h1>{this.props.listName}</h1>
        <ul className="DeviceList">
          {this.renderList()}
        </ul>
      </div>

    )
  }
}
