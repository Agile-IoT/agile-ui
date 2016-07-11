import './DeviceList.scss'
import React, { Component, PropTypes } from 'react'
import DeviceListItem from '../DeviceListItem/DeviceListItem'
import Loading from '../Loading/Loading'
import NoResults from '../NoResults/NoResults'

export default class DeviceList extends Component {

  static propTypes = {
    devices: PropTypes.array.isRequired,
    loading: PropTypes.string
  };

  renderList() {
    if ( this.props.devices.length > 0) {
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
    } else {
      return <NoResults text='No devices found'/>
    }
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
