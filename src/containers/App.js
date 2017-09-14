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
