import './DeviceListItem.scss'

import React, { Component, PropTypes } from 'react'
import {Card, CardActions, CardHeader} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'

export default class DeviceListItem extends Component {

  static propTypes = {
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    starred: PropTypes.bool,
    starDevice: PropTypes.func.isRequired,
    deleteDevice: PropTypes.func.isRequired
  }

  render () {
    return (
      <Card>
        <CardHeader
          title={this.props.name}
          subtitle="Subtitle"
          avatar="http://lorempixel.com/100/100/nature/"
        />
        <CardActions>
          <FlatButton label="starDevice" onClick={() => this.props.starDevice(this.props.id)}/>
          <FlatButton label="deleteDevice" onClick={() => this.props.deleteDevice(this.props.id)}/>
        </CardActions>
      </Card>
    )
  }
}
