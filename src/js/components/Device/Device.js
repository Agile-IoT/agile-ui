import React, { Component, PropTypes } from 'react'
import {Card, CardActions, CardHeader} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'

export default class DeviceListItem extends Component {

  static propTypes = {
    Name: PropTypes.string.isRequired
  }

  render () {
    return (
      <Card>
        <CardHeader
          title={this.props.Name}
          subtitle="Subtitle"
          avatar="http://lorempixel.com/100/100/nature/"
        />
        <CardActions>
          <FlatButton label="view on grafana" />
          <FlatButton label="Unregister" />
        </CardActions>
      </Card>
    )
  }
}
