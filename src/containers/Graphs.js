import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Graph } from '../components/';

import {
  streamsFetch,
  deviceFetch,
  retrieveData
} from '../actions';


class Graphs extends Component {
  componentDidMount() {
    window.graphs = [];
    this.props.deviceFetch(this.props.params.deviceId);
    this.props.streamsFetch(this.props.params.deviceId);
    this.props.retrieveData(this.props.params.deviceId);
  }

  componentWillUnmount() {
  }

  dataFromStream(streamId){
    return this.props.records.filter(r => r.componentID === streamId)
  }

  renderGraphs(device) {
    if(device && device.streams){
      return device.streams.map((st, i) => {
        return <Graph
          fieldName={st.id}
          id={i}
          data={this.dataFromStream(st.id)}
          graphs={this.graphs}
        />
      })
    } else {
      return null
    }
  }

  render() {
    // Use streams without device TODO
    if (this.graphs && this.graphs.length){
      var sync = window.Dygraph.synchronize(this.graphs);
    }

    const { device, records } = this.props;
    return (
      <div className='graphs'>
        {this.renderGraphs(device)}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    streams: state.streams,
    records: state.records,
    device: state.device
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    streamsFetch: (deviceId) => dispatch(streamsFetch(deviceId)),
    deviceFetch: (deviceId) => dispatch(deviceFetch(deviceId)),
    retrieveData: (deviceId) => dispatch(retrieveData(deviceId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Graphs);
