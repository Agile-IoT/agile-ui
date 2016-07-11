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

  // TODO decide on styling technique
  style = {
    AppBar: {
      margin: '0 0 20px'
    },
    Toggle: {
      margin: '0 20px 0'
    },
    Cog: {
      margin: '20px 0 0 20px',
      cursor: 'pointer'
    }
  }

  render() {
    const { actions: { drawerToggle, discoveryToggle } } = this.props
    return (
      <div>
        <FontIcon style={this.style.Cog} toggled={this.props.open}
          onTouchTap={() => drawerToggle(this.props.open)}
          className="material-icons"
          >
          settings
        </FontIcon>
        <Drawer open={this.props.open}>
          <AppBar
             title='Settings'
             style={this.style.AppBar}
             showMenuIconButton={false}
             iconElementRight={<IconButton
             onTouchTap={() => drawerToggle(this.props.open)}>
              <NavigationClose/>
             </IconButton>}
          />
          <Toggle
             label="Device Discovery"
             labelPosition="right"
             style={this.style.Toggle}
             onToggle={() => discoveryToggle(this.props.settings.discovery)}
             toggled={this.props.settings.discovery}
           />
        </Drawer>
      </div>
    )
  }
}
