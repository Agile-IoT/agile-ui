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
    actions: PropTypes.object
  }

  render () {
    console.log(this.props)
    return (
      <Link to={`/device/${this.props.id}`}>
        <Card>
          <DeviceBasicInfo
            id={this.props.path}
            name={this.props.name}
            path={this.props.path}
          />
          <DeviceActions
            actions={this.props.actions}
          />
        </Card>
      </Link>
    )
  }
}
