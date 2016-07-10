import React, { Component, PropTypes } from 'react'
import {Card, CardActions } from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import DeviceBasicInfo from './DeviceBasicInfo'

export default class Device extends Component {

  static propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    path: PropTypes.string
  }

  render () {
    return (
      <Card>
        <DeviceBasicInfo
          id={this.props.id}
          name={this.props.name}
          path={this.props.path}
        />
        <CardActions>
          <FlatButton label="Delete Device" secondary={true} onClick={() => this.props.deleteDevice(this.props.id)}/>
        </CardActions>
      </Card>
    )
  }
}
