import React, { Component, PropTypes } from 'react'
import Nav from './Nav/Nav'

export default class App extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    location: PropTypes.object
  }
  render() {
    return (
      <div>
        <Nav route={this.props.location.pathname} />
        <div className="page-container">
          {this.props.children}
        </div>
      </div>
    )
  }
}
