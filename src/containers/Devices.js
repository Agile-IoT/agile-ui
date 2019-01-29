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
import {devicesAndStreamsFetch, devicesDelete} from "../actions/devices"
import { DeviceItem } from '../components'
import { FlatButton } from 'material-ui'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import CircularProgress from 'material-ui/CircularProgress'

class Devices extends Component {
  renderActions(device) {
    const styles = {
      label: { fontSize: '1rem' },
      container: { marginTop: '5px', marginBottom: '5px' }
    }
    const id = device.deviceId
    return (
      <div className='devices' style={styles.container}>
        <Link id={`disconnect_${id}`}>
          <FlatButton labelStyle={styles.label} label='Disconnect' onClick={() => {
            this.props.devicesDelete(device.deviceId)}
          } />
          </Link>
        <Link id={`view_${id}`} to={`/graphs/${device.deviceId}`}>
          <FlatButton labelStyle={styles.label} label='View Data' />
        </Link>
        <Link id={`manage_${id}`} to={`/devices/${device.deviceId}`}>
          <FlatButton labelStyle={styles.label} label='Manage Device Data' />
        </Link>
      </div>
    )
  }

  renderItems(devices) {
    if (devices) {
      if (!Object.keys(devices).length) {
        return (
          <div style={{ width: '100%', textAlign: 'center' }}>
            <span
              style={{
                fontWeight: 'bold',
                color: '#929292',
                fontSize: '1.2rem'
              }}
            >
              No devices paired
            </span>
          </div>
        )
      }

      return Object.keys(devices).map((deviceId, i) => {
        const device = devices[deviceId]

        return (
          <DeviceItem
            expandable
            showExpandableButton
            id={deviceId}
            key={i}
            title={device.name}
            subtitle={device.deviceId}
            status={device.status}
            actions={this.renderActions(device)}
            meta={device}
          />
        )
      })
    }
  }

  componentDidMount() {
    this.props.devicesAndStreamsFetch()
  }

  render() {
    if (this.props.loading.devices) {
      return (
        <div className="loadingScreen">
          <CircularProgress size={250} thickness={10} />
        </div>
      )
    }

    return <div className="devices">{this.renderItems(this.props.devices)}</div>
  }
}

const mapStateToProps = state => {
  return {
    loading: state.loading,
    devices: state.devices
  }
}

const mapDispatchToProps = dispatch => {
  return {
    devicesAndStreamsFetch: () => dispatch(devicesAndStreamsFetch()),
    devicesDelete: deviceId => dispatch(devicesDelete(deviceId))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Devices)
