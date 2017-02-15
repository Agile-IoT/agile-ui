import React, { Component } from 'react';
import { Device } from '../components';
import { FlatButton } from 'material-ui';
import ActionSearch from 'material-ui/svg-icons/action/search';

import { connect } from 'react-redux';
import { devicesFetch } from '../actions';

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
    this.props.fetchDevices()
  }

  render() {
    return (
      <div>
        {this.renderItems(this.props.devices)}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  console.log(state)
  return {
    devices: state.devices
  };
};

const mapDispatchToProps = (dispatch) => {
    return {
      fetchDevices: (url) => dispatch(devicesFetch())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Discover);
