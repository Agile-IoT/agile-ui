import React, { Component } from 'react';
import { Device } from '../components';
import { api } from '../services';
import { FlatButton } from 'material-ui';
import ActionSearch from 'material-ui/svg-icons/action/search';

class Discover extends Component {

  constructor() {
    super()
    this.state = {}
  }

  renderActions(device) {
    return (
      <div>
        <FlatButton label='Register' onClick={() => { console.log('hiii!')}} />
      </div>
    )
  }

  renderItems(devices) {
    if (devices) {
      return devices.map((device, i) => {
        return(
          <Device
            expandable={false}
            key={i}
            title={device.name}
            subtitle={device.id}
            id={device.id}
            status={device.status}
            actions={this.renderActions(device)}
          />)
      })
    }
  }

  componentDidMount() {
    api.devicesFetch()
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

export default Discover;
