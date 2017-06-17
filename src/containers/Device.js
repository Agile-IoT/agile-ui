import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FlatButton } from 'material-ui';
import { 
  DeviceSummary,
  Stream
} from '../components';

// TODO
import {CloudStorageControls} from '../components/CloudStorageControls.js'
import {LocalStorageControls} from '../components/LocalStorageControls.js'

import { 
  deviceFetch,
  devicesDelete,
  streamsFetch,
  deviceSubscribe,
  deviceUnsubscribe,
  locStorPolicyAdd,
  locStorPolicyDelete,
  locStorPoliciesFetch,
  cloudUploadData
} from '../actions';

class Device extends Component {
  componentDidMount() {
    this.props.deviceFetch(this.props.params.deviceId);
    this.props.streamsFetch(this.props.params.deviceId);
    this.props.locStorPoliciesFetch(this.props.params.deviceId);
  }

  subscribe(device, streams) {
    if (device) {
      if (device.streams) {
        device.streams.map(s => {
          return this.props.deviceSubscribe(device.deviceId, s.id);
        });
      }
    }
  }

  unsubscribe(device) {
    if (device) {
      if (device.streams) {
        device.streams.map(s => {
          return this.props.deviceSubscribe(device.deviceId, s.id);
        });
      }
    }
  }

  componentWillUnmount() {
    this.unsubscribe(this.props.device);
  }

  componentWillReceiveProps(nextProps) {
    // Poll for new readings
    setTimeout(() => {
      this.props.streamsFetch(this.props.params.deviceId);
    }, 7000);
  }

  renderActions(device) {
    return (
      <div>
        <FlatButton label='Delete' onClick={() => {this.props.devicesDelete(device.deviceId)}} />
      </div>
    )
  }

  renderStreams(streams) {
    if (streams) {
      return streams.map((s, i) => {
        return <Stream key={i} {...s} />
      })
    }
  }

  render() {
    const { device, streams } = this.props;
    if (device) {
      return (
        <div>
          <DeviceSummary
            expandable
            showExpandableButton
            title={device.name}
            subtitle={device.deviceId}
            status={device.status}
            actions={this.renderActions(device)}
            meta={device}
          />

          <LocalStorageControls 
            expandable
            showExpandableButton
            deviceId={device.deviceId}
            streams={device.streams}
            locStorPolicies={this.props.locStorPolicies}
            locStorPolicyAdd={this.props.locStorPolicyAdd}
            locStorPolicyDelete={this.props.locStorPolicyDelete}
            locStorPoliciesFetch={this.props.locStorPoliciesFetch}
          />

          <CloudStorageControls
            expandable
            showExpandableButton
            deviceId={device.deviceId}
            streams={device.streams}
            cloudUploadData={this.props.cloudUploadData}
          />


          { this.renderStreams(streams[device.deviceId]) }
        </div>
      );
    }
    return <div></div>
  }
}

const mapStateToProps = (state) => {
  return {
    device: state.device,
    streams: state.streams,
    locStorPolicies: state.localStoragePolicies
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    deviceFetch: (deviceId) => dispatch(deviceFetch(deviceId)),
    devicesDelete: (deviceId) => dispatch(devicesDelete(deviceId)),
    streamsFetch: (deviceId) => dispatch(streamsFetch(deviceId)),
    deviceSubscribe: (deviceId, componentId) => dispatch(deviceSubscribe(deviceId, componentId)),
    deviceUnsubscribe: (deviceId, componentId) => dispatch(deviceUnsubscribe(deviceId, componentId)),

    locStorPolicyAdd: (deviceId, componentId, interval) => dispatch(locStorPolicyAdd(deviceId, componentId, interval)),
    locStorPolicyDelete: (deviceId, componentId) => dispatch(locStorPolicyDelete(deviceId, componentId)),
    locStorPoliciesFetch: (deviceId, componentId) => dispatch(locStorPoliciesFetch(deviceId, componentId)),

    cloudUploadData: (deviceId, componentId, startDate, endDate, provider) => dispatch(cloudUploadData(deviceId, componentId, startDate, endDate, provider))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Device);
