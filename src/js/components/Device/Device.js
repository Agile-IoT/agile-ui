import React, { Component, PropTypes } from 'react'
import { Card } from 'material-ui/Card'
import DeviceBasicInfo from './DeviceBasicInfo'
import DeviceActions from './DeviceActions'
import Loading from '../Loading/Loading'

export default class Device extends Component {

  static propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    path: PropTypes.string,
    loading: PropTypes.string,
    actions: PropTypes.object
  }

  render () {
    return (
      <Card>
        <Loading loading={this.props.loading} />
        <DeviceBasicInfo
          id={this.props.id}
          name={this.props.name}
          path={this.props.path}
        />
      <DeviceActions actions={this.props.actions} id={this.props.id}/>
      </Card>
    )
  }
}
