import './DeviceList.scss'
import React, { Component, PropTypes } from 'react'
import DeviceListItem from '../DeviceListItem/DeviceListItem'
import Loading from '../Loading/Loading'

export default class DeviceList extends Component {

  static propTypes = {
    devices: PropTypes.array.isRequired,
    loading: PropTypes.string
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
        <Loading loading={this.props.loading}/>
        <h1>{this.props.listName}</h1>
        <ul className="DeviceList">
          {this.renderList()}
        </ul>
      </div>

    )
  }
}
