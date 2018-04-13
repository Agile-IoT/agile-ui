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
import { connect } from 'react-redux';
import { CloudUploadSettingsSummary } from '../components'
import { cloudUploadData, fetchCloudProviders } from '../actions';

class CloudUploadSettings extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedProvider: 'owncloud',
      startDate: new Date(),
      endDate: new Date(),
      streams: props.device.streams,
      deviceId: props.device.deviceId,
      selectedComponent: props.device.streams[0].id
    }
  }

  componentDidMount() {
    this.props.fetchCloudProviders()
  }

  handleComponentChange = (event, key, value) => this.setState({selectedComponent: value})
  handleProviderChange = (event, key, value) => this.setState({selectedProvider: value})
  handleStartDateChange = (date) => this.setState({startDate: new Date(date)})
  handleEndDateChange = (date) => this.setState({endDate: new Date(date)})
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
        storageProviders={this.props.cloudProviders}
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
    fetchCloudProviders: () => dispatch(fetchCloudProviders()),
    cloudUploadData: (deviceId, componentId, startTime, endTime, provider) =>
      dispatch(cloudUploadData(deviceId, componentId, startTime, endTime, provider))
  };
};

const mapStateToProps = (state) => {
  return {
    cloudProviders: state.cloudProviders
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(CloudUploadSettings);
