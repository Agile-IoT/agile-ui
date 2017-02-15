import React, { Component } from 'react';
import { Link } from 'react-router';
import { Nav } from '../components';
// main template for containers

class App extends Component {
  render() {
    return (
      <div>
        <Nav {...this.props} />
        <div className='container--app'>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default App;
