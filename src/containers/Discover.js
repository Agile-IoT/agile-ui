/*******************************************************************************
 *Copyright (C) 2017 Resin.io, FBK, Jolocom.
 *All rights reserved. This program and the accompanying materials
 *are made available under the terms of the Eclipse Public License 2.0
 *which accompanies this distribution, and is available at
 *https://www.eclipse.org/legal/epl-2.0/
 *
 *SPDX-License-Identifier: EPL-2.0
 *
 *Contributors:
 *    Resin.io, FBK, Jolocom - initial API and implementation
 ******************************************************************************/
import React, { Component } from 'react';
import { DeviceItem } from '../components';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { connect } from 'react-redux';
import differenceBy from 'lodash/differenceBy'
import CircularProgress from 'material-ui/CircularProgress'

import {
  devicesAndStreamsFetch,
  devicesDiscover,
  devicesCreate,
  deviceTypesFetch
} from '../actions';

class Discover extends Component {

  handleChange = (event, index, value) => {
    this.props.devicesCreate(value.device, value.type)
  }

  renderDeviceTypes = (device, deviceTypes) => {
    if (deviceTypes && deviceTypes.length > 0) {
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
      <div style={{padding: '0px', margin:'0px', paddingLeft: '8px'}}>
        <SelectField
          floatingLabelText="Register"
          value={null}
          onChange={this.handleChange}
        >
        <MenuItem value={null} label="Register" primaryText="Select device type" />
        {
          this.renderDeviceTypes(device, deviceTypes[device.id])
        }
        </SelectField>
      </div>
    )
  }

  renderItems(devices) {
    const addresses = Object.keys(this.props.registeredDevices).map(key =>
      this.props.registeredDevices[key].address
    )
    if (devices.length) {
      return devices.map((device, i) => {
        if (addresses.indexOf(device.id) !== -1) {
          return null
        }

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

    return (<div style={{width: '100%', textAlign: 'center'}}>
      <span style={{fontWeight: 'bold', color: '#929292', fontSize: '1.2rem'}}>
        No new devices available
      </span>
    </div>)
  }

  updateDeviceTypes(devices) {
    // fetch list of all available device's
    devices.map((device) => {
      return this.props.deviceTypesFetch(device)
    });
  }

  componentDidMount() {
    this.props.devicesAndStreamsFetch()
    this.props.devicesDiscover()

    this.poller = setInterval(() => {
      this.props.devicesDiscover();
    }, 7000);
  }

  componentWillUnmount() {
    clearInterval(this.poller);
  }

  componentWillReceiveProps(nextProps) {
    const { devices } = nextProps;
    const newDevices = differenceBy(devices, this.props.devices, 'id')
    if (newDevices) {
      this.updateDeviceTypes(newDevices);
    }
  }

  render() {
    const {discovery, devices} = this.props
    if (devices.length === 0 && discovery) {
      return (
        <div className='loadingScreen'>
          <CircularProgress size={250} thickness={10}/>
        </div>
      )
    }

    return (
      <div className='discover'>
        {this.renderItems(this.props.devices)}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    discovery: state.discovery,
    devices: state.devicesDiscover,
    registeredDevices: state.devices,
    deviceTypes: state.deviceTypes
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    devicesAndStreamsFetch: () => dispatch(devicesAndStreamsFetch()),
    devicesDiscover: () => dispatch(devicesDiscover()),
    devicesCreate: (device, type) => dispatch(devicesCreate(device, type)),
    deviceTypesFetch: (device) => dispatch(deviceTypesFetch(device))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Discover);
