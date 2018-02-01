/*******************************************************************************
 *Copyright (C) 2017 Resin.io, FBK, Jolocom.
 *All rights reserved. This program and the accompanying materials
 *are made available under the terms of the Eclipse Public License v1.0
 *which accompanies this distribution, and is available at
 *http://www.eclipse.org/legal/epl-v10.html
 *
 *Contributors:
 *    Resin.io, FBK, Jolocom - initial API and implementation
 ******************************************************************************/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CloudUploadSettingsSummary } from '../components'
import { cloudUploadData } from '../actions';

class CloudUploadSettings extends Component {
  constructor(props) {
    super(props)
    this.state = {
      deviceId: props.device.deviceId,
      streams: props.device.streams,
      selectedComponent: props.device.streams[0].id,
      storageProviders: ['Provider A', 'Provider B', 'Provider C'],
      selectedProvider: 'Provider A',
      startDate: new Date(),
      endDate: new Date()
    }
  }

  handleComponentChange = (event, key, value) => this.setState({selectedComponent: value})
  handleProviderChange = (event, key, value) => this.setState({selectedProvider: value})
  handleStartDateChange = (event, date) => this.setState({startDate: date})
  handleEndDateChange = (event, date) => this.setState({endDate: date})
  handleButtonClick = () => {
    this.props.cloudUploadData(
      this.state.deviceId,
      this.state.selectedComponent,
      this.state.startDate,
      this.state.endDate,
      this.state.selectedProvider
    )
  }

  render() {
    return (
      <CloudUploadSettingsSummary
        deviceId={this.state.deviceId}
        streams={this.state.streams}
        startDate={this.state.startDate}
        endDate={this.state.endDate}

        selectedComponent={this.state.selectedComponent}
        selectedProvider={this.state.selectedProvider}
        storageProviders={this.state.storageProviders}
        handleComponentChange={this.handleComponentChange}
        handleProviderChange={this.handleProviderChange}
        handleStartDateChange={this.handleStartDateChange}
        handleEndDateChange={this.handleEndDateChange}
        handleButtonClick={this.handleButtonClick}
      />
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    cloudUploadData: (deviceId, componentId, startDate, endDate, provider) =>
      dispatch(cloudUploadData(deviceId, componentId, startDate, endDate, provider))
  };
};

export default connect(mapDispatchToProps)(CloudUploadSettings);
