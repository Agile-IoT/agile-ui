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
import { Tabs, Tab } from 'material-ui/Tabs';
import React, { Component } from 'react';
import { browserHistory } from 'react-router';

export default class Nav extends Component {
  handleActive(tab) {
    browserHistory.push(tab.props.value)
  }
  render () {
    return (
      <Tabs value={this.props.location.pathname}>
        <Tab label="Discover"
        value="/"
        onActive={this.handleActive}
        >
        </Tab>
        <Tab label="Devices"
          value="/devices"
          onActive={this.handleActive}
        >
        </Tab>
      </Tabs>
    )
  }
}
