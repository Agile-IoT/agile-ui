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
import {
  drawerToggle,
} from '../actions'
import {discoveryStatus, discoveryToggle, startDiscovery} from "../actions/discovery"
import {protcolConfigSet, protocolsFetch} from "../actions/protocols"

import { SettingsMenu } from '../components'

class Settings extends Component {
  componentDidMount() {
    this.props.protocolsFetch()
    this.props.startDiscovery()
    this.props.discoveryStatus()
  }

  render() {
    return <SettingsMenu {...this.props} />
  }
}

const mapStateToProps = state => {
  return {
    discovery: state.discovery,
    drawer: state.drawer,
    protocols: state.protocols
  }
}

const mapDispatchToProps = dispatch => {
  return {
    startDiscovery: () => dispatch(startDiscovery()),
    drawerToggle: bool => dispatch(drawerToggle(bool)),
    discoveryToggle: bool => dispatch(discoveryToggle(bool)),
    protocolsFetch: () => dispatch(protocolsFetch()),
    discoveryStatus: () => dispatch(discoveryStatus()),
    protocolConfigSet: (protocolId, configuration) => dispatch(protcolConfigSet(protocolId, configuration))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings)
