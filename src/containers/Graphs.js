// TODO STREAMS FETCH AND RETRIEVE DATA

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Graph } from '../components/';

import { streamsFetch } from '../actions';


class Graphs extends Component {
  constructor(props){
      super(props);

      this.state={
        streams: this.props.streams[this.props.params.deviceId]
      }
  }

  componentDidMount() {
    // TODO Refresh on the page
    this.props.streamsFetch(this.props.params.deviceId)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      streams: nextProps.streams[this.props.params.deviceId]
    })

    setTimeout(() => {
      this.props.streamsFetch(this.props.params.deviceId);
    }, 2000);
  }

  renderGraphs(streams) {
    return streams.map(st => {
     return <Graph
       key={st.componentID}
       deviceId={this.props.params.deviceId}
       componentId={st.componentID}
     />
   })
  }

  render() {
    const { streams } = this.state;
    return (
      <div className='graphs'>
        {streams
          ? this.renderGraphs(streams)
          : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    streams: state.streams
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    streamsFetch: (deviceId) => dispatch(streamsFetch(deviceId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Graphs);
