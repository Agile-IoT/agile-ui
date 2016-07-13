import React, { Component, PropTypes } from 'react'
import {Card, CardHeader} from 'material-ui/Card'
import Avatar from 'material-ui/Avatar'
var randomMC = require('random-material-color')

export default class DeviceStream extends Component {

  static propTypes = {
    id: PropTypes.string,
    unit: PropTypes.string
  }

  render () {
    return (
      <Card>
        <CardHeader
          title={this.props.id}
          subtitle={this.props.unit}
          avatar={<Avatar backgroundColor={randomMC.getColor()}>{this.props.value}</Avatar>}
        />
      </Card>
    )
  }
}
