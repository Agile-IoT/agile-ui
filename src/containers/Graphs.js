/*******************************************************************************
 *Copyright (C) 2017 Resin.io, FBK, Jolocom.
 *All rights reserved. This program and the accompanying materials
 *are made available under the terms of the Eclipse Public License 2.0
 *which accompanies this distribution, and is available at
 *https://www.eclipse.org/legal/epl-2.0/
 *
 *SPDX-License-Identifier: EPL-2.0
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
import { browserHistory } from 'react-router'
import IconButton from 'material-ui/IconButton'
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back.js'
import {
  deviceFetch
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

    if(!device) {
      this.props.deviceFetch(deviceId)
    }
  }

  renderGraphs(streams) {
    return streams.map(st => {
     return <Graph
       key={st.id}
       deviceId={this.props.params.deviceId}
       componentId={st.id}
       graphsArray={this.state.graphs}
     />
   })
  }

  renderNoDataMessage() {
    return <Toolbar>
      <ToolbarGroup >
        <IconButton iconStyle={{transform: 'scale(1.6)'}}onClick={() => {browserHistory.goBack()}}>
          <ArrowBack color={'black'}/>
        </IconButton>
        <ToolbarSeparator / >
      </ToolbarGroup>
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
      <ToolbarGroup >
        <IconButton iconStyle={{transform: 'scale(1.6)'}}onClick={() => {browserHistory.goBack()}}>
          <ArrowBack color={'black'}/>
        </IconButton>
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
    const {graphs} = this.state
    const streams = this.props.devices[this.props.params.deviceId].streams

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
    deviceFetch: deviceId => dispatch(deviceFetch(deviceId)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Graphs)
