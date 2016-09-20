import React, { Component, PropTypes } from 'react'
import Drawer from 'material-ui/Drawer'
import FontIcon from 'material-ui/FontIcon'
import Toggle from 'material-ui/Toggle'
import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'
import NavigationClose from 'material-ui/svg-icons/navigation/close'
import { List, ListItem } from 'material-ui/List'
import Divider from 'material-ui/Divider'

export default class Settings extends Component {

  static propTypes = {
    discovery: PropTypes.bool.isRequired,
    actions: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    error: PropTypes.object
  }

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

  renderList (protocols) {
    if (Object.keys(protocols).length > 0) {
      return Object.keys(protocols).map((protocolId) =>
        (
          <div key={protocols[protocolId].name}>
            <ListItem primaryText={protocols[protocolId].name} secondaryText={protocols[protocolId].status} />
            <Divider />
          </div>
        )
      )
    }
  }

  render() {
    const { actions: { drawerToggle, discoveryToggle }, discovery, open } = this.props
    return (
      <div>
        <FontIcon style={this.style.Cog} toggled={open}
          onTouchTap={() => drawerToggle(open)}
          className="material-icons"
          >
          settings
        </FontIcon>
        <Drawer open={open}>
          <AppBar
             title='Settings'
             style={this.style.AppBar}
             showMenuIconButton={false}
             iconElementRight={<IconButton
             onTouchTap={() => drawerToggle(open)}>
              <NavigationClose/>
             </IconButton>}
          />
          <Toggle
             label="Device Discovery"
             labelPosition="right"
             style={this.style.Toggle}
             onToggle={() => discoveryToggle(discovery)}
             toggled={discovery}
           />
         <List>
         {this.renderList(this.props.protocols)}
         </List>
        </Drawer>
      </div>
    )
  }
}
