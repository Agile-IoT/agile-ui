import React, { Component, PropTypes } from 'react'
import {Card, CardHeader} from 'material-ui/Card'

export default class DeviceActions extends Component {

  static propTypes = {
    title: PropTypes.string,
    unit: PropTypes.string
  }

  render () {
    return (
      <Card>
        <CardHeader
          title={this.props.name}
          subtitle={this.props.unit}
          avatar={<Avatar>{this.props.name ?  this.props.name.charAt(0): '' }</Avatar>}
        />
      </Card>
    )
  }
}
