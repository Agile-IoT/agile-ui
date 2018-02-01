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
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { discoveryToggle, drawerToggle, protocolsFetch, discoveryStatus } from '../actions';
import { SettingsMenu } from '../components';

class Settings extends Component {
  componentDidMount() {
    this.props.protocolsFetch()
    this.props.discoveryStatus()
  }

  render() {
    return (
      <SettingsMenu
        {...this.props}
      />
    )
  }

}

const mapStateToProps = (state) => {
  return {
    discovery: state.discovery,
    drawer: state.drawer,
    protocols: state.protocols
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    drawerToggle: (bool) => dispatch(drawerToggle(bool)),
    discoveryToggle: (bool) => dispatch(discoveryToggle(bool)),
    protocolsFetch: () => dispatch(protocolsFetch()),
    discoveryStatus: () => dispatch(discoveryStatus()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings)
