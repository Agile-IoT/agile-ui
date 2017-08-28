import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  recordsFetch,
  deviceSubscribe,
  streamsFetch
} from '../actions';

class Graph extends Component {
  constructor(props){
    super(props)
    this.state = {
      g: undefined,
      data: []
    }
  }

  componentDidMount(){
    const {deviceId, componentId} = this.props
    this.props.recordsFetch(deviceId, componentId)
    this.props.deviceSubscribe(deviceId, componentId)
  }

  componentDidUpdate() {
    this.renderGraph()
  }

  componentWillReceiveProps(nextProps){
    let toAdd = this.state.data.concat()

    if (toAdd && toAdd.length  === 0)
      if (nextProps.records[this.props.deviceId].length)
        toAdd = formatData(nextProps.records[this.props.deviceId], this.props.componentId)

    if (nextProps.streams[this.props.deviceId]) {
      const latest = this.props.streams[this.props.deviceId]
        .find(str => str.componentID === this.props.componentId)

      const {lastUpdate, value} = latest
      toAdd.push([new Date(lastUpdate), parseInt(value)])
    }

    this.setState({data: toAdd})
  }

  render(){
    if (this.state.data.length === 0)
      return null

    if (document.getElementById(`graphdiv${this.props.componentId}`))
      this.renderGraph()

    return (
      <div className='graph'>
        <div
          id={`graphdiv${this.props.componentId}`}
          style={{
            "width": "100%",
            "height": "100%"
          }}
        >
        </div>
      </div>
    )
  }

  renderGraph(){
    if (!document.getElementById(`graphdiv${this.props.componentId}`))
      return

    if (this.state.g) {
      this.state.g.updateOptions( {'file': this.state.data} );
    } else {
      this.state.g = new window.Dygraph(
        document.getElementById(`graphdiv${this.props.componentId}`),
        this.state.data,
        {
          title: ' ',
          legend: 'always',
          fillGraph: true,
          strokeWidth: 1.5,
          color: '#00BCD4',
          labels: ['Time', this.props.componentId]
        }
      );
    }
  }
}

// This is here because the api call to retrieve data per componentID is not
// yet working
const _tempSortFunc = (data, componentId) => {
  const relevant = []
  data.forEach(r => {
    if (r.componentID === componentId)
      relevant.push([new Date(r.lastUpdate), parseInt(r.value)])
  })

  return relevant
}

const formatData = (data, compId) => {
  var graphData = _tempSortFunc(data, compId)
  /*
  data.forEach(r => {
    graphData.push([new Date(r.lastUpdate), parseInt(r.value)])
  })
  */

  return graphData
}

const mapStateToProps = (state) => {
  return {
    streams: state.streams,
    records: state.records
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    deviceSubscribe: (deviceId, componentId) => dispatch(deviceSubscribe(deviceId, componentId)),
    recordsFetch: (deviceId, componentId) => dispatch(recordsFetch(deviceId, componentId)),
    streamsFetch: (deviceId) => dispatch(streamsFetch(deviceId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Graph);
