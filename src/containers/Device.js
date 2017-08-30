import React, {Component} from 'react';
import {connect} from 'react-redux';
import {FlatButton} from 'material-ui';
import {DeviceSummary, Stream} from '../components';
import {
  deviceFetch,
  devicesDelete,
  streamsFetch,
  deviceSubscribe,
  deviceUnsubscribe,
  setEntityData,
  deleteAttribute
} from '../actions';

import SecurityDetails from './SecurityDetails';
import {entityFetch} from '../actions/index';

const hiddenAndDisabledAttributes = {
  notEditable: ['id', 'owner', 'type'],
  hidden: ['password']
};

class Device extends Component {

  componentWillMount() {
    this.props.entityFetch('device')
  }

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

  getEntity() {
    for (var i in this.props.entityList) { //Get the right entity from the entity list
      var e = this.props.entityList[i];
      if (e.id === this.props.params.deviceId && e.type.replace('/', '') === 'device' ? e : undefined)
        return e;
    }
  }

  render() {
    var entity = this.getEntity();
    const { device, streams } = this.state;
    if (device && entity) {
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
          <SecurityDetails
            expandable
            showExpandableButton
            title={'Security'}
            subtitle={''}
            entity={entity}
            entityType={'device'}
            fieldProperties={hiddenAndDisabledAttributes}
          />
          {this.renderStreams(streams[device.deviceId])}
        </div>
      );
    } else if (device) {
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
        </div>)
    }
    return <div></div>
  }
}

const mapStateToProps = (state) => {
  return {
    devices: state.devices,
    streams: state.streams,
    actions: state.entityPolicies,
    entityList: state.entityList
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    deviceFetch: (deviceId) => dispatch(deviceFetch(deviceId)),
    devicesDelete: (deviceId) => dispatch(devicesDelete(deviceId)),
    streamsFetch: (deviceId) => dispatch(streamsFetch(deviceId)),
    deviceSubscribe: (deviceId, componentId) => dispatch(deviceSubscribe(deviceId, componentId)),
    deviceUnsubscribe: (deviceId, componentId) => dispatch(deviceUnsubscribe(deviceId, componentId)),
    setEntityAttributes: (params) => dispatch(setEntityData(params)),
    deleteAttribute: (params) => dispatch(deleteAttribute(params)),
    entityFetch: (params) => dispatch(entityFetch(params))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Device);
