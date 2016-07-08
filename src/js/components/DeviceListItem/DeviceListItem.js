import './DeviceListItem.scss'
import React, { Component, PropTypes } from 'react'
import {Card, CardActions, CardHeader} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import Avatar from 'material-ui/Avatar';

export default class DeviceListItem extends Component {

  static propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    starDevice: PropTypes.func.isRequired,
    deleteDevice: PropTypes.func.isRequired
  }

  render () {
    return (
      <Card>
        <CardHeader
          title={this.props.name}
          subtitle={this.props.path}
          avatar={<Avatar>{this.props.name.charAt(0)}</Avatar>}
        />
        <CardActions>
          <FlatButton label="Delete Device" secondary={true} onClick={() => this.props.deleteDevice(this.props.id)}/>
        </CardActions>
      </Card>
    )
  }
}
