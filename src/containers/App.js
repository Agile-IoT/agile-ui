import React, { Component } from 'react';
import { Link } from 'react-router';
import { Nav } from '../components';
import { MessageBar, LoadingBar, Settings } from './'
// main template for containers

class App extends Component {
  render() {
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
