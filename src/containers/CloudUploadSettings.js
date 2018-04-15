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
      selectedComponent: props.device.streams[0].id,
      dynamicFields: {}
    }
  }

  componentDidMount() {
    this.props.fetchCloudProviders()
  }

  handleDynamicFieldsChange = (fieldName, value) => {
    const newDynamicFields = Object.assign({}, this.state.dynamicFields, {
      [fieldName]: value
    })
    this.setState({
      dynamicFields: newDynamicFields
    })
  }

  handleComponentChange = (event, key, value) => this.setState({selectedComponent: value})
  handleProviderChange = (event, key, value) => this.setState({
    selectedProvider: value,
    dynamicFields: {}
  })
  handleStartDateChange = (date) => this.setState({startDate: new Date(date)})
  handleEndDateChange = (date) => this.setState({endDate: new Date(date)})
  handleButtonClick = () => {

    const {
      deviceId,
      selectedComponent,
      startDate,
      endDate,
      selectedProvider,
      dynamicFields
    } = this.state

    this.props.cloudUploadData({
      selectedProvider,
      data: { deviceId, componentId: selectedComponent, startDate, endDate },
      customArgs: dynamicFields
    })
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
        dynamicFieldValues={this.state.dynamicFields}
        handleComponentChange={this.handleComponentChange}
        handleProviderChange={this.handleProviderChange}
        handleStartDateChange={this.handleStartDateChange}
        handleEndDateChange={this.handleEndDateChange}
        handleDynamicFieldsChange={this.handleDynamicFieldsChange}
        handleButtonClick={this.handleButtonClick}
      />
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchCloudProviders: () => dispatch(fetchCloudProviders()),
    cloudUploadData: (options) =>
      dispatch(cloudUploadData(options))
  };
};

const mapStateToProps = (state) => {
  return {
    cloudProviders: state.cloudProviders
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(CloudUploadSettings);
