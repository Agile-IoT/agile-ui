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
import {
  locStorPoliciesFetch,
  locStorPolicyAdd,
  locStorPolicyDelete,
  recordsDelete,
  recordsFetch
} from "../actions/localStorage"
import { LocStorSettingsSummary } from '../components';

import {
  hideConfirmationScreen
} from '../actions';

class LocalStorageSettings extends Component {
  constructor(props) {
    super(props)
    this.pollPending = false
    this.state = {
      deviceId: props.device.deviceId,
      streams: props.device.streams,
      interval: 3000,
      retention: 7,
      selectedComponent: props.device.streams[0].id,
      shouldEncrypt: false,
      publicKey: ''
    }
  }

  componentDidMount() {
    this.state.streams.forEach(st =>
      this.props.recordsFetch(this.props.device.deviceId, st.id)
    )

    this.props.locStorPoliciesFetch(this.props.device.deviceId)
  }

  toggleEncryption = () => this.setState({
    shouldEncrypt: !this.state.shouldEncrypt,
    publicKey: ''
  })
  handlePublicKeyChange = (event, value) => this.setState({publicKey: value})
  handleIntervalChange = (event, value) => this.setState({interval: value})
  handleRetentionChange = (event, value) => this.setState({retention: value})
  handleComponentChange = (event, key, value) => this.setState({selectedComponent: value})
  handleButtonClick = () => {
    this.props.locStorPolicyAdd({
      deviceID: this.state.deviceId,
      componentID: this.state.selectedComponent,
      interval: this.state.interval,
      retention: this.state.retention,
      publicKey: this.state.publicKey
    })

    this.setState({
      shouldEncrypt: false,
      publicKey: ''
    })
  }

  componentWillUpdate() {
    if (this.pollPending) {
      return
    }

    this.pollPending = true
    setTimeout(() => {
      this.state.streams.forEach(st => {
        this.props.recordsFetch(this.props.device.deviceId, st.id)
      })
      this.pollPending = false
    }, 7000)
  }

  render() {
    const { localStorage, locStorPolicyDelete } = this.props;
    let existing = false

    if (localStorage[this.state.deviceId]) {
      existing = localStorage[this.state.deviceId].find(pol =>
        pol.componentID === this.state.selectedComponent
      )
    }

    return (
      <LocStorSettingsSummary
        deviceId={this.state.deviceId}
        streams={this.state.streams}
        interval={this.state.interval}
        retention={this.state.retention}
        shouldEncrypt={this.state.shouldEncrypt}
        policyExists={existing}
        records={this.props.records}
        publicKey={this.state.publicKey}
        selectedComponent={this.state.selectedComponent}
        renderConfirmScreen={this.props.confirmationScreen}
        closeConfirmScreen={this.props.hideConfirmationScreen}
        handleIntervalChange={this.handleIntervalChange}
        handleComponentChange={this.handleComponentChange}
        handleRetentionChange={this.handleRetentionChange}
        handleButtonClick={this.handleButtonClick}
        localStorage={localStorage[this.state.deviceId]}
        locStorPolicyDelete={locStorPolicyDelete}
        recordsDelete={this.props.recordsDelete}
        handlePublicKeyChange={this.handlePublicKeyChange}
        toggleEncryption={this.toggleEncryption}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    localStorage: state.localStorage,
    records: state.records,
    streams: state.streams,
    confirmationScreen: state.confirmationScreen
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    locStorPolicyAdd: (deviceId, componentId, interval, retention) =>
      dispatch(locStorPolicyAdd(deviceId, componentId, interval, retention)),
    locStorPolicyDelete: (deviceId, componentId) => dispatch(locStorPolicyDelete(deviceId, componentId)),
    locStorPoliciesFetch: (deviceId, componentId) => dispatch(locStorPoliciesFetch(deviceId, componentId)),
    recordsDelete: (deviceId, componentId) => dispatch(recordsDelete(deviceId, componentId)),
    recordsFetch: (deviceId, componentId) => dispatch(recordsFetch(deviceId, componentId)),
    hideConfirmationScreen: () => dispatch(hideConfirmationScreen())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LocalStorageSettings);
