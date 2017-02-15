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
