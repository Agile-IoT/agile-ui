import React, { Component } from 'react';
import { Device } from '../components';
import { FlatButton } from 'material-ui';
import { connect } from 'react-redux';

import { devicesDiscover, devicesCreate } from '../actions';

class Discover extends Component {

  renderActions(device) {
    return (
      <div>
        <FlatButton label='Register' onClick={() => { this.props.devicesCreate(device)}} />
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
    this.props.devicesDiscover()
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
  return {
    devices: state.devicesDiscover
  };
};


const mapDispatchToProps = (dispatch) => {
  return {
    devicesDiscover: () => dispatch(devicesDiscover()),
    devicesCreate: (device) => dispatch(devicesCreate(device))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Discover);
