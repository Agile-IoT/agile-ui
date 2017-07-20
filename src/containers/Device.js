import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FlatButton } from 'material-ui';
import { DeviceSummary, Stream } from '../components';
import { deviceFetch, devicesDelete, streamsFetch, deviceSubscribe, deviceUnsubscribe } from '../actions';

class Device extends Component {
  constructor(props) {
    super(props);

    this.state = {
      device: this.props.devices[this.props.params.deviceId],
      streams: this.props.streams[this.props.params.deviceId]
    }
  }

  componentDidMount() {
    // In case we refresh on this view
    if(!this.state.device)
      this.props.deviceFetch(this.props.params.deviceId)

    if(!this.state.streams)
      this.props.streamsFetch(this.props.params.deviceId)
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
    this.unsubscribe(this.state.device);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.device)
      this.setState({device: nextProps.devices[this.props.params.deviceId]})
    if (!this.state.streams)
      this.setState({streams: nextProps.streams[this.props.params.deviceId]})


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
    const { device, streams } = this.state;
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
          { this.renderStreams(streams[device.deviceId]) }
        </div>
      );
    }
    return <div></div>
  }
}

const mapStateToProps = (state) => {
  return {
    devices: state.devices,
    streams: state.streams
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    deviceFetch: (deviceId) => dispatch(deviceFetch(deviceId)),
    devicesDelete: (deviceId) => dispatch(devicesDelete(deviceId)),
    streamsFetch: (deviceId) => dispatch(streamsFetch(deviceId)),
    deviceSubscribe: (deviceId, componentId) => dispatch(deviceSubscribe(deviceId, componentId)),
    deviceUnsubscribe: (deviceId, componentId) => dispatch(deviceUnsubscribe(deviceId, componentId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Device);
