import {Tabs, Tab} from 'material-ui/Tabs'
import React, { Component, PropTypes } from 'react'
import { browserHistory } from 'react-router'

export default class Nav extends Component {
  static propTypes = {
    route: PropTypes.string
  }
  handleActive(tab) {
    browserHistory.push(tab.props.value)
  }
  render () {
    console.log(this.props.route)
    return (
      <Tabs value={this.props.route } >
        <Tab label="Devices"
        value="/"
        onActive={this.handleActive}
        >
        </Tab>
        <Tab label="Discover"
          value="/discover"
          onActive={this.handleActive}
        >
        </Tab>
      </Tabs>
    )
  }
}
