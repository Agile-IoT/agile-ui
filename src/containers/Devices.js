import React, { Component } from 'react';
import { Device } from '../components';
import { api } from '../services';
import { FlatButton } from 'material-ui';
import ActionSearch from 'material-ui/svg-icons/action/search';

class Devices extends Component {

  constructor() {
    super()
    this.state = {}
  }

  renderActions(device) {
    return (
      <div>
        <FlatButton label='Delete' onClick={() => { console.log('hiii!')}} />
        <FlatButton label='View Data' onClick={() => { console.log('hiii!')}} />
        <FlatButton label='Connect' onClick={() => { console.log('hiii!')}} />
      </div>
    )
  }

  renderItems(devices) {
    if (devices) {
      return devices.map((device, i) => {
        return(
          <Device
            expandable
            showExpandableButton
            key={i}
            title={device.name}
            subtitle={device.address}
            status={device.status}
            actions={this.renderActions(device)}
            meta={device}
          />)
      })
    }
  }

  componentDidMount() {
    api.registeredDevicesFetch()
    .then(res => {
      this.setState({ devices: res.data });
    })
    .catch(err => {
      console.error(err)
    });
  }

  render() {
    return (
      <div>
        {this.renderItems(this.state.devices)}
      </div>
    );
  }
}

export default Devices;
