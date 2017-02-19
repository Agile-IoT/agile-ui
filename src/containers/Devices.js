import React, { Component } from 'react';
import { DeviceItem } from '../components';
import { FlatButton } from 'material-ui';
import { connect } from 'react-redux';
import { devicesFetch, devicesDelete } from '../actions';

class Devices extends Component {

  renderActions(device) {
    return (
      <div>
        <FlatButton label='Delete' onClick={() => {this.props.devicesDelete(device.deviceId)}} />
        <FlatButton href={`/devices/${device.deviceId}`} label='View' />
      </div>
    )
  }

  renderItems(devices) {
    if (devices) {
      return devices.map((device, i) => {
        return(
          <DeviceItem
            expandable
            showExpandableButton
            key={i}
            title={device.name}
            subtitle={device.deviceId}
            status={device.status}
            actions={this.renderActions(device)}
            meta={device}
          />)
      })
    }
  }

  componentDidMount() {
    this.props.devicesFetch()
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
    devices: state.devices
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    devicesFetch: () => dispatch(devicesFetch()),
    devicesDelete: (deviceId) => dispatch(devicesDelete(deviceId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Devices);
