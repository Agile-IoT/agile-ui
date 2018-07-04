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
import React from 'react'
import SelectField from 'material-ui/SelectField'

import DateTimePicker from 'material-ui-datetimepicker'
import DatePickerDialog from 'material-ui/DatePicker/DatePickerDialog'
import TimePickerDialog from 'material-ui/TimePicker/TimePickerDialog'
import MenuItem from 'material-ui/MenuItem'
import TextField from 'material-ui/TextField'
import { Card, CardHeader, CardText, } from 'material-ui/Card'
import { List } from 'material-ui/List'
import { FlatButton } from 'material-ui'
import Subheader from 'material-ui/Subheader';
import InfoIcon from 'material-ui/svg-icons/action/info-outline.js'
import FindReplaceIcon from 'material-ui/svg-icons/action/find-replace.js'
import SaveIcon from 'material-ui/svg-icons/content/save.js'
import IconButton from 'material-ui/IconButton'

import { GenericListItem } from '../components'
const CloudUploadSettingsSummary = (props) => {
  const styles = {
    fullwidth: {
      textAlign: 'right',
      width: '100%'
    },
    buttonLabel: {
      fontSize: '1rem',
      fontWeight: 'bold'
    },
    title: {
      fontSize: '1rem'
    },
    listItems: {
      bar: {
        backgroundColor: '#f1f1f1'
      },
      rightEl: {
        margin: '0px',
        padding: '0px',
      },
      leftEl: {
        fontSize: '1rem'
      }
    },
    subheader : {
      marginLeft: '0.5rem',
      padding: '0px',
      fontWeight: 'bold',
      fontSize: '1.2rem',
      color: '#000'
    },
    card : {
      backgroundColor: '#f1f1f1'
    },
    button : {
      textAlign: 'center',
      marginTop: '2rem',
      width: '100%'
    }
  }

  const {storageProviders} = props

  const {title, card, subheader, button, buttonLabel} = styles

  let selectedProvider
  let missingData

  if (storageProviders.length) {
    selectedProvider = storageProviders
      .find(pr => pr.cloudName === props.selectedProvider)

    missingData = selectedProvider.requiredFields.some(f => !props.dynamicFieldValues[f.name])
  }

  return(
    <Card>
      <CardHeader
        title={ <span style={title}> EXPORT LOCAL DATA </span> }
        subtitle={storageProviders.length ? '' : 'Fetching available cloud providers...'}
        actAsExpander={storageProviders.length}
        expandable
        showExpandableButton
      />

      {storageProviders.length 
        ? <CardText style={card} expandable>
          <Subheader style={subheader}> Export to cloud provider </Subheader>
          <List>

            {renderProviderSelection(props, styles)}
            {renderCommonFields(props, styles)}
            {renderRequestedArguments(props, styles)}

            <FlatButton
              style={button}
              labelStyle={buttonLabel}
              backgroundColor={'rgba(34, 187, 60, 0.5)'}
              label='Upload'
              disabled={missingData}
              onClick={props.handleButtonClick}
            />

          </List>
        </CardText>
      :null
      }
    </Card>
  )
}

const renderProviderSelection = (props, styles) => {
  return <GenericListItem
    style={styles.listItems}
    leftEl='Storage Provider'
    rightEl={
      <SelectField
        value={props.selectedProvider}
        onChange={props.handleProviderChange}
        style={{textAlign: 'right'}}
      >
        {props.storageProviders.map(p => {
          return <MenuItem
            key= {p.cloudName}
            value={p.cloudName}
            primaryText={p.displayName}
          />
        })}
      </SelectField>
    }
  />
}

const renderCommonFields = (props, styles) => {
  return [<GenericListItem
    style={styles.listItems}
    leftEl='Component Id'
    rightEl={
      <SelectField
        value={props.selectedComponent}
        onChange={props.handleComponentChange}
        style={{textAlign: 'right'}}
      >
      {props.streams.map(s =>
        <MenuItem value={s.id} primaryText={s.id} />)
      }
      </SelectField>
    }
  />,

  <GenericListItem
    style={styles.listItems}
    leftEl='Start Date'
    rightEl={
      <DateTimePicker
        format="hh:mm A DD MMM"
        showCurrentDateByDefault={true}
        DatePicker={DatePickerDialog}
        TimePicker={TimePickerDialog}
        hintText="From"
        inputStyle={styles.fullwidth}
        onChange={props.handleStartDateChange}
      />
    }
  />,

  <GenericListItem
    style={styles.listItems}
    leftEl='End Date'
    rightEl={
      <DateTimePicker
        style={{textAlign: 'right'}}
        format="hh:mm A DD MMM"
        showCurrentDateByDefault={true}
        DatePicker={DatePickerDialog}
        TimePicker={TimePickerDialog}
        hintText="Untill"
        inputStyle={styles.fullwidth}
        onChange={props.handleEndDateChange}
      />
    }
  />]
}

const renderRequestedArguments = (props, styles) => {
  const selected = props.storageProviders
    .find(pr => pr.cloudName === props.selectedProvider)
  const {requiredFields} = selected

  const renderedFields = requiredFields.map(f =>
    <GenericListItem
      style={styles.listItems}
      leftEl={f.displayName}
      rightEl={
        <div>
        <TextField
          style={{textAlign: 'right'}}
          inputStyle={styles.fullwidth}
          value={props.dynamicFieldValues[f.name]}
          onChange={(e, value) => {
            props.handleDynamicFieldsChange(f.name, value)
          }}
        />
          <IconButton
            tooltip={f.description}
            tooltipPosition="bottom-left"
            tooltipStyles={{fontSize: '16px'}}
          >
            <InfoIcon />
          </IconButton>

          <IconButton
            tooltip='Attempt to fetch the credential from Agile Security.'
            tooltipStyles={{fontSize: '16px'}}
            tooltipPosition='bottom-left'
            onClick={() =>
              props.populateFromIDM(props.selectedProvider, f.name)
            }
          >
            <FindReplaceIcon />
          </IconButton>

          <IconButton
            tooltip='Save the credential using Agile Security.'
            disabled={!props.dynamicFieldValues[f.name]}
            tooltipStyles={{fontSize: '16px'}}
            tooltipPosition='bottom-left'
            onClick={() =>
              props.saveCredential(props.selectedProvider, f.name)
            }
          >
            <SaveIcon />
          </IconButton>
        </div>
      }
    />
  )

  return [
    <Subheader style={styles.subheader}> Provider specific configuration </Subheader>,
    ...renderedFields]
}

export default CloudUploadSettingsSummary
