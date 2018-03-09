/*******************************************************************************
 *Copyright (C) 2017 Resin.io, FBK, Jolocom.
 *All rights reserved. This program and the accompanying materials
 *are made available under the terms of the Eclipse Public License v1.0
 *which accompanies this distribution, and is available at
 *http://www.eclipse.org/legal/epl-v10.html
 *
 *Contributors:
 *    Resin.io, FBK, Jolocom - initial API and implementation
 ******************************************************************************/
import React, { Component } from 'react'
import { connect } from 'react-redux'
import Checkbox from 'material-ui/Checkbox'
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar'
import CircularProgress from 'material-ui/CircularProgress'
import { Graph } from '../components/'
import {
  streamsFetch ,
} from '../actions'

class Graphs extends Component {
  constructor(props){
      super(props)

      this.state = {
        graphs: [],
        synchronize: undefined
      }
  }

  componentDidMount() {
    const {deviceId} = this.props.params
    const device = this.props.devices[deviceId]
    const streams = this.props.streams[deviceId]

    if(!device) {
      this.props.deviceFetch(deviceId)
    }

    if(!streams) {
      this.props.streamsFetch(deviceId)
    }
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
    const {graphs} = this.state
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
         <Checkbox
          onCheck = {() => this.toggleSynchronize()}
          disabled = {graphs && graphs.length < 2}
        />
        </ToolbarGroup>
      </ToolbarGroup>
     </Toolbar>
  }

  toggleSynchronize() {
    const {graphs, synchronize} = this.state

    if ((graphs && graphs.length < 2) || !graphs) {
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
    const streams = this.props.streams[this.props.params.deviceId]
    const {graphs} = this.state

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
          : <div className='loadingScreen'>
              <CircularProgress size={250} thickness={10}/>
            </div>
        }
        </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    streams: state.streams,
    devices: state.devices
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    streamsFetch: deviceId => dispatch(streamsFetch(deviceId)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Graphs)
