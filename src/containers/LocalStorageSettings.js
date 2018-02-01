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
import { LocStorSettingsSummary } from '../components';

import {
  locStorPolicyAdd,
  locStorPolicyDelete,
  locStorPoliciesFetch,
  streamsFetch
} from '../actions';

class LocalStorageSettings extends Component {
  constructor(props) {
    super(props)
    this.state = {
      deviceId: props.device.deviceId,
      streams: props.device.streams,
      interval: 3000,
      retention: 7,
      selectedComponent: props.device.streams[0].id
    }
  }

  componentDidMount() {
    this.props.streamsFetch(this.props.device.deviceId)
    this.props.locStorPoliciesFetch(this.props.device.deviceId);
  }

  handleIntervalChange = (event, value) => this.setState({interval: value})
  handleRetentionChange = (event, value) => this.setState({retention: value})
  handleComponentChange = (event, key, value) => this.setState({selectedComponent: value})
  handleButtonClick = () => {
    const existing =
      this.props.localStorage.find(pol => pol.componentID === this.state.selectedComponent)

    if (!existing)
      this.props.locStorPolicyAdd(
        this.state.deviceId,
        this.state.selectedComponent,
        this.state.interval,
        this.state.retention
      )
  }

  render() {
    const { localStorage, locStorPolicyDelete } = this.props;
    return (
      <LocStorSettingsSummary
        deviceId={this.state.deviceId}
        streams={this.state.streams}
        interval={this.state.interval}
        retention={this.state.retention}

        selectedComponent={this.state.selectedComponent}

        handleIntervalChange={this.handleIntervalChange}
        handleComponentChange={this.handleComponentChange}
        handleRetentionChange={this.handleRetentionChange}
        handleButtonClick={this.handleButtonClick}

        localStorage={localStorage}
        locStorPolicyDelete={locStorPolicyDelete}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    localStorage: state.localStorage
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    streamsFetch: (deviceId) => dispatch(streamsFetch(deviceId)),
    locStorPolicyAdd: (deviceId, componentId, interval, retention) =>
      dispatch(locStorPolicyAdd(deviceId, componentId, interval, retention)),
    locStorPolicyDelete: (deviceId, componentId) => dispatch(locStorPolicyDelete(deviceId, componentId)),
    locStorPoliciesFetch: (deviceId, componentId) => dispatch(locStorPoliciesFetch(deviceId, componentId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LocalStorageSettings);
