import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FlatButton } from 'material-ui';
import { DeviceSummary, Stream } from '../components';
import { deviceFetch, devicesDelete, streamsFetch } from '../actions';

class Device extends Component {
  componentDidMount() {
    this.props.deviceFetch(this.props.params.deviceId)
    this.props.streamsFetch(this.props.params.deviceId)
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
          { this.renderStreams(streams) }
        </div>
      );
    }
    return <div></div>
  }
}

const mapStateToProps = (state) => {
  return {
    device: state.device,
    streams: state.streams
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    deviceFetch: (deviceId) => dispatch(deviceFetch(deviceId)),
    devicesDelete: (deviceId) => dispatch(devicesDelete(deviceId)),
    streamsFetch: (deviceId) => dispatch(streamsFetch(deviceId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Device);
