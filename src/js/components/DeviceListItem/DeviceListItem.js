import './DeviceListItem.scss'
import React, { Component, PropTypes } from 'react'
import {Card, CardActions } from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import Avatar from 'material-ui/Avatar'
import { Link } from 'react-router'

import DeviceBasicInfo from '../Device/DeviceBasicInfo'

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
      <Link to={`/device/${this.props.id}`}>
        <Card>
          <DeviceBasicInfo
            id={this.props.path}
            name={this.props.name}
            path={this.props.path}
          />
          <CardActions>
            <FlatButton label="Delete Device" secondary={true} onClick={() => this.props.deleteDevice(this.props.id)}/>
          </CardActions>
        </Card>
      </Link>
    )
  }
}
