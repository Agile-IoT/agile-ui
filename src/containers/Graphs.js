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
  deviceSubscribe,
  deviceUnsubscribe
} from '../actions'

class Graphs extends Component {
  constructor(props){
      super(props)
      this.state={
        device: this.props.devices[this.props.params.deviceId],
        streams: this.props.streams[this.props.params.deviceId],
        graphs: [],
        synchronize: undefined
      }
  }

  componentDidMount() {
    this.subscribe()

    if(!this.state.device)
      this.props.deviceFetch(this.props.params.deviceId)

    if(!this.state.streams)
      this.props.streamsFetch(this.props.params.deviceId)

    this.props.streamsFetch(this.props.params.deviceId)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({streams: nextProps.streams[this.props.params.deviceId]})

    if (!this.state.device)
      this.setState({device: nextProps.devices[this.props.params.deviceId]})

    setTimeout(() => {
      this.props.streamsFetch(this.props.params.deviceId)
    }, 2000)
  }

  subscribe() {
    const { device } = this.state

    if (device && device.streams) {
      device.streams.map(s => {
        return this.props.deviceSubscribe(device.deviceId, s.id)
      })
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
    const { graphs, synchronize } = this.state

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

  componentWillUnmount() {
    if (this.props.params.deviceId && this.state.streams) {
      this.state.streams.forEach((s) => {
        this.props.deviceUnsubscribe(this.props.params.deviceId, s.id)
      })
    }
  }

  render() {
    const { streams, graphs } = this.state
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
    deviceSubscribe: (deviceId, componentId) => 
      dispatch(deviceSubscribe(deviceId, componentId)),
    deviceUnsubscribe: (deviceId, componentId) => 
      dispatch(deviceUnsubscribe(deviceId, componentId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Graphs)
