/*******************************************************************************
 *Copyright (C) 2017 Resin.io, FBK, Jolocom.
 *All rights reserved. This program and the accompanying materials
 *are made available under the terms of the Eclipse Public License v1.0
 *which accompanies this distribution, and is available at
 *http://www.eclipse.org/legal/epl-v10.html
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
import { Card, CardHeader, CardText, } from 'material-ui/Card'
import { List } from 'material-ui/List'
import { FlatButton } from 'material-ui'
import Subheader from 'material-ui/Subheader';

import { GenericListItem } from '../components'
const CloudUploadSettingsSummary = (props) => {
  const styles = {
    fullwidth: {
      textAlign: 'right',
      width: '100%'
    },
    button: {
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
  }

  const styledTitle = (<span style={styles.title}> EXPORT LOCAL DATA </span>)
  return(
    <Card>
      <CardHeader
        title={styledTitle}
        actAsExpander
        showExpandableButton
      />

      <CardText style={{backgroundColor: '#f1f1f1'}} expandable>
        <Subheader style={styles.subheader}> Export to cloud provider </Subheader>
        <List>
          <GenericListItem
            style={styles.listItems}
            leftEl='Storage Provider'
            rightEl={
              <SelectField
                value={props.selectedProvider}
                onChange={props.handleProviderChange}
                style={{textAlign: 'right'}}
              >
                {props.storageProviders.map(provider => {
                  return <MenuItem 
                    key= {provider} 
                    value={provider} 
                    primaryText={provider}
                  />
                })}
              </SelectField>}
          />

          <GenericListItem
            style={styles.listItems}
            leftEl='Component Id'
            rightEl={
              <SelectField
                value={props.selectedComponent}
                onChange={props.handleComponentChange}
                style={{textAlign: 'right'}}
              >
              {formatStreams(props.streams)}
            </SelectField>}
          />

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
          />

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
          />

          <FlatButton
            style={Object.assign({}, styles.fullwidth, {
              textAlign: 'center',
              marginTop: '2rem'
            })}
            labelStyle={styles.button}
            backgroundColor={'rgba(34, 187, 60, 0.5)'}
            hoverColor={'rgba(34, 187, 60, 0.5)'}
            label='Upload'
            onClick={props.handleButtonClick}
          />
        </List>
      </CardText>
    </Card>
  ) 
}

const formatStreams = (streams) => {
  return streams.map(s => {
    return <MenuItem value={s.id} primaryText={s.id} />
  })
}

export default CloudUploadSettingsSummary
