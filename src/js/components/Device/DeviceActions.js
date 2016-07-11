import React, { Component, PropTypes } from 'react'
import {CardActions} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'

export default class DeviceActions extends Component {

  static propTypes = {
    actions: PropTypes.object,
    id: PropTypes.string
  }

  render () {
    return (
      <CardActions>
        <FlatButton label='Delete'
          onClick={() => this.props.actions.deviceDelete('DELETE', '/devices', this.props.id)}
        />
     </CardActions>
    )
  }
}
