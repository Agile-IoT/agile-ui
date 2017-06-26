import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  streamsFetch,
  retrieveData
} from '../actions';


class Visualization extends Component {
  componentDidMount() {
    this.props.streamsFetch(this.props.params.deviceId);
  }

  _tempDrawGraph() {

    var CSV = 'Date, Temperature'

    this.props.records.forEach(r => {
      if (r.componentID === 'Humidity')
        CSV += `,\n${r.lastUpdate}, ${r.value}`
    })

    var g = new window.Dygraph(
      document.getElementById("graphdiv"),
      CSV
    );
  }

  componentWillUnmount() {
  }

  render() {
    const { streams, records } = this.props;

    if (document.getElementById('graphdiv'))
      this._tempDrawGraph()

    return (
      <span onClick={() => this.props.retrieveData(this.props.params.deviceId)}>
        Hello booooooy {records.length}
        <div id='graphdiv'/>
      </span>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    streams: state.streams,
    records: state.records
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    streamsFetch: (deviceId) => dispatch(streamsFetch(deviceId)),
    retrieveData: (deviceId) => dispatch(retrieveData(deviceId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Visualization);
