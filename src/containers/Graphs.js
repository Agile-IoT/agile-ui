import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Graph } from '../components/';
import Checkbox from 'material-ui/Checkbox'
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import {
  streamsFetch ,
  deviceSubscribe,
  deviceUnsubscribe
} from '../actions';
import CircularProgress from 'material-ui/CircularProgress';


class Graphs extends Component {
  constructor(props){
      super(props);
      this.state={
        streams: this.props.streams[this.props.params.deviceId],
        graphs: [],
        synchronize: undefined
      }
  }

  componentDidMount() {

    // TODO Refresh on the page
    if (this.props.params.deviceId && this.state.streams) {
      this.state.streams.forEach((s) => {
        this.props.deviceSubscribe(this.props.params.deviceId, s.id);
      });
    }

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
       graphsArray={this.state.graphs}
     />
   })
  }

  renderNoDataMessage() {
    return <Toolbar>
      <ToolbarGroup >
        <ToolbarTitle text='No incoming or local data available' />
      </ToolbarGroup>
      <ToolbarGroup >
        <CircularProgress size={30}/>
      </ToolbarGroup>
     </Toolbar>
  }

  renderSettings() {
    return <Toolbar>
      <ToolbarGroup>
        <ToolbarTitle text='Settings' />
        <ToolbarSeparator / >
      </ToolbarGroup>

      <ToolbarGroup>
        <ToolbarGroup>
         <ToolbarTitle text='Synchronize' />
        </ToolbarGroup>
        <ToolbarGroup>
         <Checkbox onCheck = {() => this.toggleSinchronize()} />
        </ToolbarGroup>
      </ToolbarGroup>
     </Toolbar>
  }

  toggleSinchronize() {
    const { graphs, synchronize } = this.state

    if ((graphs && graphs.length === 0) || !graphs) {
      return
    }

    if (synchronize) {
      synchronize.detach()
      this.setState({synchronize: undefined})
    } else {
      const synchronize = window.Dygraph.synchronize(graphs, {
        range: false
      })
      this.setState({synchronize})
    }
  }

  componentWillUnmount() {
    if (this.props.params.deviceId && this.state.streams) {
      this.state.streams.forEach((s) => {
        this.props.deviceUnsubscribe(this.props.params.deviceId, s.id);
      });
    }
  }

  render() {
    const { streams, graphs } = this.state;
    return (
      <div>
        {
          graphs.length === 0
            ? this.renderNoDataMessage()
            : this.renderSettings()
        }
        {
          streams
          ? <div className='graphs'>
              {this.renderGraphs(streams)}
            </div>
          : <div id='loadingScreen'>
              <CircularProgress size={250} thickness={10}/>
            </div>
        }
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
    streamsFetch: deviceId => dispatch(streamsFetch(deviceId)),
    deviceSubscribe: (deviceId, componentId) => 
      dispatch(deviceSubscribe(deviceId, componentId)),
    deviceUnsubscribe: (deviceId, componentId) => 
      dispatch(deviceUnsubscribe(deviceId, componentId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Graphs);
