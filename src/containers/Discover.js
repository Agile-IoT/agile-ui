import React, { Component } from 'react';
import { Device } from '../components';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { connect } from 'react-redux';

import { devicesDiscover, devicesCreate, deviceTypesFetch } from '../actions';

class Discover extends Component {

  handleChange = (event, index, value) => {
    console.log(value.type)
    this.props.devicesCreate(value.device, value.type)
  }

  renderDeviceTypes = (device, deviceTypes) => {
    if (deviceTypes.length > 0) {
      return deviceTypes.map((type, key) => {
        return (
          <MenuItem
            key={`${device}-key`}
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
          <Device
            expandable={false}
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
    this.props.devicesDiscover()
    this.props.deviceTypesFetch()
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
    deviceTypesFetch: () => dispatch(deviceTypesFetch())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Discover);
