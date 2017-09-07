import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  recordsFetch,
  deviceSubscribe,
  deviceUnsubscribe
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

  componentWillUnmount() {
    const { deviceId, componentId } = this.props
    this.props.deviceUnsubscribe(deviceId, componentId)
  }

  componentDidUpdate() {
    this.renderGraph()
  }

  componentWillReceiveProps(nextProps){
    let toAdd = this.state.data.concat()

    const { deviceId, componentId } = this.props
    const agileDataRecords = nextProps.records[deviceId]

    // If data is empty, populate with local records from Agile Data
    if (this.state.data && this.state.data.length === 0) {
      if (agileDataRecords && agileDataRecords.length)
        toAdd = formatData(agileDataRecords, componentId)
    }

    // Append the latest, realTime data to the graph
    if (nextProps.streams[deviceId]) {
      const realTimeRecord = this.props.streams[deviceId]
        .find(str => str.componentID === componentId)

      const {lastUpdate, value} = realTimeRecord
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
      const g = new window.Dygraph(
        document.getElementById(`graphdiv${this.props.componentId}`),
        this.state.data,
        {
          title: ' ',
          legend: 'always',
          fillGraph: true,
          strokeWidth: 1.5,
          color: '#00BCD4',
          labels: ['Time', this.props.componentId],
          animatedZooms: true,
          stackedGraphNaNFill: 'inside'
        }
      );
      this.props.graphsArray.push(g)
      this.setState({ g: g })
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
    deviceUnsubscribe: (deviceId, componentId) => dispatch(deviceUnsubscribe(deviceId, componentId)),
    recordsFetch: (deviceId, componentId) => dispatch(recordsFetch(deviceId, componentId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Graph);
