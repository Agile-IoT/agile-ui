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
import { Dialog, MenuItem, TextField, Checkbox, FlatButton, SelectField } from 'material-ui'
import AppBar from 'material-ui/AppBar'
import Divider from 'material-ui/Divider'
import Drawer from 'material-ui/Drawer'
import IconButton from 'material-ui/IconButton'
import { List, ListItem } from 'material-ui/List'
import InfoIcon from 'material-ui/svg-icons/action/info-outline.js'
import ActionSettings from 'material-ui/svg-icons/action/settings'
import NavigationClose from 'material-ui/svg-icons/navigation/close'
import Toggle from 'material-ui/Toggle'
import React, { Component } from 'react'
import * as validator from 'validator'

class ProtocolList extends Component {
  state = {
    selected: ''
  }

  handleConfigDialogClose = () => {
    this.setState({ selected: '' })
  }

  render() {
    const { protocols } = this.props
    const { selected } = this.state

    if (protocols && protocols.length === 0) {
      return (
        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', textAlign: 'center', color: 'rgb(146, 146, 146)' }}>
          No protocols available
        </div>
      )
    }

    const selectedProtocol = protocols.find(p => p.id === selected)

    return (
      <List>
        <ConfigurationDialog
          handleClose={this.handleConfigDialogClose}
          handleSubmit={this.props.handleSubmit}
          configuration={selectedProtocol && selectedProtocol.configuration}
          protocol={selectedProtocol}
        />

        {protocols.map(protocol => [
          <div
            style={{
              display: 'flex',
              lexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginRight: '10%'
            }}
            key={protocol.name}
          >
            <ListItem primaryText={protocol.name} disabled secondaryText={protocol.status} />
            {!!protocol.configuration.length && (
              <ActionSettings
                style={{ cursor: 'pointer', color: '#e2e2e2', margin: 0 }}
                onTouchTap={() => {
                  this.setState({ selected: protocol.id })
                }}
              />
            )}
          </div>,
          <Divider />
        ])}
      </List>
    )
  }
}

class ConfigurationDialog extends Component {
  state = {
    configuration: []
  }

  componentWillReceiveProps(newProps) {
    this.setState({ configuration: newProps.configuration || [] })
  }

  handleFieldUpdate = (key, value, type) => {
    const { configuration } = this.state
    const shallowCopy = [...configuration]

    const toReplaceIdx = configuration.findIndex(entry => entry.key === key)

    shallowCopy.splice(toReplaceIdx, 1, {
      ...configuration[toReplaceIdx],
      value
    })

    this.setState({ configuration: shallowCopy })
  }

  handleConfigUpdate = () => {
    this.props.handleSubmit(this.props.protocol.dbusInterface, this.state.configuration)
  }

  renderInputField = entry => {
    const style = {
      text: {
        flex: 0.2
      },
      inputField: {
        flex: 0.6
      },
      checkboxInputField: {
        justifySelf: 'flex-start',
        display: 'flex'
      }
    }

    const suffix = entry.mandatory ? ' *' : ''
    const toRender = [<span style={style.text}>{entry.name + suffix} </span>]
    if (entry.type === 'bool') {
      return [
        ...toRender,
        <Checkbox
          key={entry.key}
          style={{ ...style.checkboxInputField, ...style.inputField }}
          onClick={() => this.handleFieldUpdate(entry.key, !entry.value, entry.type)}
          checked={JSON.parse(entry.value)}
        />
      ]
    }

    const multipleOptions = entry.valid_values && entry.valid_values.split(',').length > 1

    if (!multipleOptions) {
      return [
        ...toRender,
        <TextField
          style={style.inputField}
          errorText={!entry.valid && entry.valid_values}
          value={entry.value || entry.default}
          name={entry.key}
          onChange={e => this.handleFieldUpdate(entry.key, e.target.value, entry.type)}
        />
      ]
    }

    const options = entry.valid_values.split(',').map(option => (entry.type === 'int' ? parseInt(option) : option))

    return [
      ...toRender,
      <SelectField
        value={entry.value || entry.default_value}
        maxHeight={300}
        fullWidth
        style={style.inputField}
        onChange={(e, i, value) => this.handleFieldUpdate(entry.key, value, entry.type)}
      >
        {options.map(option => (
          <MenuItem value={option} primaryText={option} />
        ))}
      </SelectField>
    ]
  }

  renderIcon = (description, lasteElement) => {
    return (
      <IconButton
        tooltip={description}
        tooltipPosition={lasteElement ? 'top-left' : 'bottom-left'}
        tooltipStyles={{ fontSize: '16px' }}
      >
        <InfoIcon />
      </IconButton>
    )
  }

  render() {
    const style = {
      buttonInactive: {
        backgroundColor: '#e2e2e2'
      },
      buttonActive: {
        marginLeft: '5%',
        backgroundColor: 'rgba(34, 187, 60, 0.5)'
      }
    }

    const withValiditiy = this.state.configuration.map(entry => ({
      ...entry,
      valid: validateInput(entry.value, entry.type)
    }))

    const mandatory = withValiditiy.filter(entry => entry.mandatory)
    const allPresent = mandatory.every(option => option.value !== '')
    const canSubmit = allPresent && withValiditiy.every(el => el.valid || el.valid !== 'undefined')

    return (
      <Dialog
        open={!!this.state.configuration.length}
        onRequestClose={this.props.handleClose}
        title={`Configuration for ${this.props.protocol && this.props.protocol.name}`}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        autoScrollBodyContent={true}
        modal={false}
        actions={[
          <FlatButton label="Discard" style={style.buttonInactive} onClick={this.props.handleClose} />,
          <FlatButton
            label="Apply"
            disabled={!canSubmit}
            style={style.buttonActive}
            onClick={this.handleConfigUpdate}
          />
        ]}
      >
        <Divider style={{ height: '2px', marginBottom: '15px' }} />
        {withValiditiy.map((entry, index, total) => {
          return [
            <div
              key={entry.key}
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                margnTop: '20px',
                justifyContent: 'space-between'
              }}
            >
              {[...this.renderInputField(entry), this.renderIcon(entry.description, index === total.length - 1)]}
            </div>
          ]
        })}
      </Dialog>
    )
  }
}

const SettingsMenu = props => {
  const { drawerToggle, discoveryToggle, discovery, drawer } = props

  const style = {
    AppBar: {
      margin: '0 0 20px'
    },
    Toggle: {
      marginLeft: '10%',
      width: '80%'
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
        <Divider style={{ marginTop: '15px', marginBottom: '15px' }} />
        <ProtocolList handleSubmit={props.protocolConfigSet} protocols={props.protocols} />
      </Drawer>
    </div>
  )
}

export default SettingsMenu

const validateInput = (value, type) => {
  const validationMethodByType = {
    int: value => validator.isNumeric(value) || validator.isHexadecimal(value.replace('0x', '')),
    string: validator.isAlphanumeric
  }

  if (!validationMethodByType[type]) return undefined

  try {
    return validationMethodByType[type](value + '')
  } catch (err) {
    return false
  }
}
