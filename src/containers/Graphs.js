// TODO STREAMS FETCH AND RETRIEVE DATA

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Graph } from '../components/';
import MenuItem from 'material-ui/MenuItem';
import Checkbox from 'material-ui/Checkbox'
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import { streamsFetch } from '../actions';


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

  render() {
    const { streams } = this.state;
    return (
      <div>
        {this.renderSettings()}
        <div className='graphs'>
          {streams
            ? this.renderGraphs(streams)
            : null}
        </div>
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
