import React, { Component } from 'react';
import { DeviceItem } from '../components';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { connect } from 'react-redux';

import { devicesDiscover, devicesCreate, deviceTypesFetch } from '../actions';

class Discover extends Component {

  handleChange = (event, index, value) => {
    this.props.devicesCreate(value.device, value.type)
  }

  renderDeviceTypes = (device, deviceTypes) => {
    if (deviceTypes.length > 0) {
      return deviceTypes.map((type, key) => {
        return (
          <MenuItem
            key={`${device.id}-${key}`}
            value={{device, type}}
            primaryText={type}
          />
        );
      });
    }
  }

  renderActions(device, deviceTypes) {
    return (
      <div>
        <SelectField
          floatingLabelText="Register"
          value={null}
          onChange={this.handleChange}
        >
        <MenuItem value={null} label="Register" primaryText="Select device type" />
        {
          this.renderDeviceTypes(device, deviceTypes)
        }
        </SelectField>
      </div>
    )
  }

  renderItems(devices) {
    if (devices) {
      return devices.map((device, i) => {
        return(
          <DeviceItem
            key={i}
            title={device.name}
            subtitle={device.id}
            id={device.id}
            status={device.status}
            actions={this.renderActions(device, this.props.deviceTypes)}
          />)
      })
    }
  }

  componentDidMount() {
    this.props.devicesDiscover();
    this.props.devices.map((device) => {
      return this.props.deviceTypesFetch(device)
    });
  }

  componentWillReceiveProps(nextProps) {
    // get new deviceTypes if there are new devices
    const { devices } = nextProps
    if (devices.length > this.props.devices.length) {
      devices.map((device) => {
        return this.props.deviceTypesFetch(device)
      });
    }

    // Poll for new devices
    setTimeout(() => {
      this.props.devicesDiscover()
    }, 7000);
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
    devices: state.devicesDiscover,
    deviceTypes: state.deviceTypes
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    devicesDiscover: () => dispatch(devicesDiscover()),
    devicesCreate: (device, type) => dispatch(devicesCreate(device, type)),
    deviceTypesFetch: (device) => dispatch(deviceTypesFetch(device))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Discover);
