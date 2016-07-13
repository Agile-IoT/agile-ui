import React, { Component, PropTypes } from 'react'
import {CardActions} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'

export default class DeviceActions extends Component {

  static propTypes = {
    actions: PropTypes.object,
    id: PropTypes.string
  }

  render () {
    let buttons
    console.log(this.actions)
    if (this.props.actions.registerDevice) {
      // device is not registered
      buttons = <FlatButton label='Register'
        onClick={() => this.props.actions.deviceDelete('DELETE', '/devices', this.props)}
      />
    } else {
      buttons = <div>
        <FlatButton label='Delete'
          onClick={() => this.props.actions.deviceDelete('DELETE', '/devices', this.props.id)}
        />
      </div>
    }
    return (
      <CardActions>
        {buttons}
     </CardActions>
    )
  }
}
