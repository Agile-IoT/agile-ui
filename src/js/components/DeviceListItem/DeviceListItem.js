import React, { Component, PropTypes } from 'react'
import { Card } from 'material-ui/Card'
import { Link } from 'react-router'

import DeviceBasicInfo from '../Device/DeviceBasicInfo'
import DeviceActions from '../Device/DeviceActions'

export default class DeviceListItem extends Component {

  static propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    device: PropTypes.object,
    actions: PropTypes.array
  }

  render () {
    return (

        <Card>
          <Link to={`/device/${this.props.id}`}>
          <DeviceBasicInfo
            id={this.props.path}
            name={this.props.name}
            path={this.props.path}
          />
          </Link>
          <DeviceActions
            device={this.props.device}
            actions={this.props.actions}
          />
        </Card>

    )
  }
}
