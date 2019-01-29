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
import React, { Component } from 'react';
import {setToken} from "../store"
import { Nav } from './';
import { MessageBar, LoadingBar, Settings } from './'
// main template for containers

class App extends Component {
  render() {
    if(this.props.location.query && this.props.location.query.token){
     setToken(this.props.location.query.token);
    }
    return (
      <div>
        <LoadingBar />
        <Nav {...this.props} />
        <Settings />
        <MessageBar />
        <div className='container--app'>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default App;
