import React, { Component, PropTypes } from 'react'
import Drawer from 'material-ui/Drawer'
import FontIcon from 'material-ui/FontIcon'
import Toggle from 'material-ui/Toggle'
import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'
import NavigationClose from 'material-ui/svg-icons/navigation/close'

export default class Settings extends Component {

  static propTypes = {
    settings: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    error: PropTypes.object
  }

  constructor(props) {
    super(props)
    this.state = {open: false}
  }

  style = {
    AppBar: {
      margin: '0 0 20px'
    },
    Toggle: {
      margin: '0 20px 0'
    }
  }

  drawerToggle = () => {
    this.setState({open: !this.state.open})
  }

  discoveryToggle = () => {
    let method

    if (this.props.settings.discovery) {
      method = 'DELETE'
    } else {
      method = 'POST'
    }

    this.props.actions.discovery(method, '/protocols/discovery').payload.then((response) => {
      !response.error ? this.props.actions.discoverySuccess() : this.props.actions.discoveryFailure(response.payload)
    }).catch((error) => {
      this.props.actions.discoveryFailure(error)
    })
  }
  render() {
    return (
      <div>
        <FontIcon toggled={this.props.open} onTouchTap={this.drawerToggle} className="material-icons">
          settings
        </FontIcon>
        <Drawer open={this.state.open}>
          <AppBar
             title='Settings'
             style={this.style.AppBar}
             showMenuIconButton={false}
             iconElementRight={<IconButton  onTouchTap={this.drawerToggle}><NavigationClose/></IconButton>}
          />
          <Toggle
             label="Device Discovery"
             labelPosition="right"
             style={this.style.Toggle}
             onToggle={this.discoveryToggle}
             toggled={this.props.settings.discovery}
           />
        </Drawer>
      </div>
    )
  }
}
