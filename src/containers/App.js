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
import { Nav } from './';
import { MessageBar, LoadingBar, Settings } from './'
import { setToken } from '../actions'
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
