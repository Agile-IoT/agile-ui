/*******************************************************************************
 *Copyright (C) 2017 Resin.io, FBK, Jolocom.
 *All rights reserved. This program and the accompanying materials
 *are made available under the terms of the Eclipse Public License 2.0
 *which accompanies this distribution, and is available at
 *https://www.eclipse.org/legal/epl-2.0/
 *
 *SPDX-License-Identifier: EPL-2.0
 *
 *Contributors:
 *    Resin.io, FBK, Jolocom - initial API and implementation
 ******************************************************************************/
import React, { Component } from 'react'
import Drawer from 'material-ui/Drawer'
import Toggle from 'material-ui/Toggle'
import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'
import NavigationClose from 'material-ui/svg-icons/navigation/close'
import ActionSettings from 'material-ui/svg-icons/action/settings'
import { List, ListItem } from 'material-ui/List'
import Divider from 'material-ui/Divider'
import { Dialog, FlatButton } from 'material-ui'
import Form from 'react-jsonschema-form'

class ProtocolList extends Component {
  state = {
    selected: ''
  }

  render() {
    const { protocols } = this.props
    const { selected } = this.state

    if (protocols && protocols.length === 0) {
      return null
    }

    const selectedProtocol = protocols.find(p => p.id === selected)
    return (
      <List>
        {selectedProtocol && configurationDialog(selectedProtocol)}
        {protocols.map(protocol => (
          <div key={protocol.name}>
            <ListItem primaryText={protocol.name} secondaryText={protocol.status} />
            {protocol.configuration.length && (
              <ActionSettings
                style={{ margin: '20px 0 0 20px', cursor: 'pointer' }}
                onTouchTap={() => {
                  this.setState({ selected: protocol.id })
                }}
              />
            )}
            <Divider />
          </div>
        ))}
      </List>
    )
  }
}

const configurationDialog = protocol => {
  const { configuration } = protocol
  const parsed = configuration.map(entry => ({...entry, mandatory: JSON.parse(entry.mandatory)}))

  const properties = parsed.reduce((acc, curr) => ({...acc, [curr.key]: {
    title: curr.name,
    type: curr.type,
  }}), {})

  const schema = {
    type: 'object',
    required: parsed.filter(entry => entry.mandatory).map(entry => entry.key),
    properties
  }

  return (
    <Dialog
      open={true}
      title="Configuration"
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
    <div style={{height: '70vh'}}>
      <Form style={{height: '100%', backgroundColor: 'red'}}schema={schema}> 
        <FlatButton />
      </Form>
    </div>
    </Dialog>
  )
}

const SettingsMenu = props => {
  const { drawerToggle, discoveryToggle, discovery, drawer } = props

  const style = {
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

  return (
    <div>
      <ActionSettings style={style.Cog} onTouchTap={() => drawerToggle(drawer)} />
      <Drawer open={drawer}>
        <AppBar
          title="Settings"
          style={style.AppBar}
          showMenuIconButton={false}
          iconElementRight={
            <IconButton onTouchTap={() => drawerToggle(drawer)}>
              <NavigationClose />
            </IconButton>
          }
        />
        <Toggle
          label="Device Discovery"
          labelPosition="right"
          style={style.Toggle}
          onToggle={() => discoveryToggle(discovery)}
          toggled={discovery}
        />
        <ProtocolList protocols={props.protocols} />
      </Drawer>
    </div>
  )
}

export default SettingsMenu
