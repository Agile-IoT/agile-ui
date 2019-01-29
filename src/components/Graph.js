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
import Resizable from 're-resizable'
import { deviceSubscribe, deviceUnsubscribe } from '../actions/devices'
import {recordsFetch} from "../actions/localStorage"

class Graph extends Component {
  constructor(props) {
    super(props)

    this.graphRegistered = false
    this.localDataRendered = false

    this.state = {
      g: undefined,
      data: []
    }
  }

  componentDidMount() {
    const { deviceId, componentId } = this.props
    this.props.recordsFetch(deviceId, componentId)
    this.props.deviceSubscribe(deviceId, componentId)
  }

  componentWillReceiveProps(nextProps) {
    const { deviceId, componentId } = this.props
    const dataToRender = this.state.data.concat()

    const localData = nextProps.records[deviceId] && nextProps.records[deviceId][componentId]
    const localDataFound = localData && localData.length

    if (!this.localDataRendered && localDataFound) {
      this.localDataRendered = true
      dataToRender.push(...localData)
    }

    const newStreams = nextProps.streams[deviceId]
    if (newStreams) {
      const realTimeRecord = newStreams.find(s => s.componentID === componentId)

      if (realTimeRecord) {
        const { lastUpdate, value } = realTimeRecord
        dataToRender.push([new Date(lastUpdate), parseInt(value, 10)])
      }
    }
    this.setState({ data: dataToRender })
  }

  componentDidUpdate() {
    const elementId = `graphdiv${this.props.componentId}`
    const element = document.getElementById(elementId)
    if (element) {
      this.renderGraph(element)
    }
  }

  getStyles() {
    return {
      graphDiv: { height: '100%', width: '100%' },
      resizeableEl: {
        defaultSize: {
          width: '45%',
          height: window.innerWidth * 0.8 * 0.45
        },
        minWidth: 200,
        minHeight: 200
      }
    }
  }

  render() {
    if (this.state.data.length === 0) {
      return null
    }

    const elementId = `graphdiv${this.props.componentId}`
    const { resizeableEl, graphDiv } = this.getStyles()

    return (
      <Resizable
        defaultSize={resizeableEl.defaultSize}
        minWidth={resizeableEl.minWidth}
        minHeight={resizeableEl.minHeight}
        onResize={() => {
          this.state.g.resize()
        }}
        className="graph"
      >
        <div id={elementId} style={graphDiv} />
      </Resizable>
    )
  }

  renderGraph(element) {
    const graphAlreadyRendered = this.state.g || false
    if (graphAlreadyRendered) {
      this.state.g.updateOptions({ file: this.state.data })
      return
    }

    const component = this.props.streams[this.props.deviceId].find(
      stream => stream.componentID === this.props.componentId
    )

    const unit = component ? component.unit : 'Units not available'
    const extraOptions = {
      title: ' ',
      legend: 'always',
      fillGraph: true,
      animatedZooms: true,
      strokeWidth: 1.5,
      drawPoints: true,
      pointSize: 2,
      color: '#00BCD4',
      labels: ['Time', this.props.componentId],
      axes: { y: { valueFormatter: v => `${v} ${unit}` } },
      stackedGraphNaNFill: 'inside'
    }

    const g = new window.Dygraph(element, this.state.data, extraOptions)

    if (!this.graphRegistered) {
      this.props.registerGraph(g)
      this.graphRegistered = true
    }

    this.setState({ g })
  }

  componentWillUnmount() {
    const { deviceId, componentId } = this.props
    this.props.deviceUnsubscribe(deviceId, componentId)
  }
}

const mapStateToProps = state => {
  return {
    streams: state.streams,
    records: state.records
  }
}

const mapDispatchToProps = dispatch => {
  return {
    deviceSubscribe: (deviceId, componentId) => dispatch(deviceSubscribe(deviceId, componentId)),
    deviceUnsubscribe: (deviceId, componentId) => dispatch(deviceUnsubscribe(deviceId, componentId)),
    recordsFetch: (deviceId, componentId) => dispatch(recordsFetch(deviceId, componentId))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Graph)
