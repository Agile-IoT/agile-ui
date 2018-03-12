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
import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import Subheader from 'material-ui/Subheader';
import { FlatButton } from 'material-ui';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import { List } from 'material-ui/List';
import { 
  GenericListItem,
  LocalStoragePolicies,
  LocalDataOverview
} from './';

const styles = {
  button: {
    fontSize: '1rem',
    fontWeight: 'bold'
  },
  title: {
    fontSize: '1rem'
  },
  divider: {
    marginTop: '30px',
    margin: '30px',
    height: '1px',
    backgroundColor: '#e0e0e0'
  },
  listItems: {
    bar: {
      backgroundColor: '#f1f1f1' 
    },
    rightEl: {
      fontSize: '1rem',
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
  buttonInactive: {
    marginTop: '2rem',
    backgroundColor: '#e2e2e2',
    width: '100%'
  },
  buttonActive: {
    marginTop: '2rem',
    backgroundColor: 'rgba(34, 187, 60, 0.5)',
    width: '100%'
  }
}

const LocStorSettingsSummary = (props) => {
  const {
    deviceId,
    streams,
    interval,
    retention,
    policyExists,
    records,
    localStorage,
    locStorPolicyDelete,
    recordsDelete,
    selectedComponent,
    handleComponentChange,
    handleIntervalChange,
    handleRetentionChange,
    handleButtonClick
  } = props

  const styledTitle = (<span style={styles.title}> MANAGE LOCAL DATA </span>)
  return (
    <Card>
      <CardHeader
        title={styledTitle}
        actAsExpander
        showExpandableButton
      />
    <CardText style={{backgroundColor: '#f1f1f1'}} expandable>
      <LocalDataOverview
        records={records}
        recordsDelete={recordsDelete}
        deviceId={deviceId}
      />
      <LocalStoragePolicies
        policies={localStorage}
        handleRemoval={locStorPolicyDelete}
      />
      <Subheader style={styles.subheader}> Add new local storage policy </Subheader>
      <List>
        <GenericListItem
          style={styles.listItems}
          leftEl='Device Id'
          rightEl={<code>{deviceId}</code>}
        />

        <GenericListItem
          style={styles.listItems}
          leftEl='Component Id'
          rightEl={
            <SelectField
              value={selectedComponent}
              onChange={handleComponentChange}
              style={{textAlign:'right'}}
            >
              {formatStreams(streams)}
            </SelectField>
          }
        />

        <GenericListItem
          style={styles.listItems}
          leftEl='Interval'
          rightEl={
            <TextField
              value={interval}
              onChange={handleIntervalChange}
              inputStyle={{textAlign: 'right'}}
              hintText='Frequency in MS'/>
          }
        />

        <GenericListItem
          style={styles.listItems}
          leftEl='Retention'
          rightEl={
            <TextField
              value={retention}
              onChange={handleRetentionChange}
              inputStyle={{textAlign: 'right'}}
              hintText='Period in days'/>
          }
        />

        <FlatButton
          style={!interval || !retention || policyExists ? styles.buttonInactive : styles.buttonActive}
          backgroundColor={'rgba(34, 187, 60, 0.5)'}
          disabled={ !interval || !retention || policyExists }
          labelStyle={styles.button}
          label='Add'
          onClick={handleButtonClick}
        />
      </List>
    </CardText>
  </Card>
  )
}

const formatStreams = (streams) => {
  if(streams) {
    return streams.map(s => {
      return <MenuItem key={s.id} value={s.id} primaryText={s.id} />
    })
  }
}

export default LocStorSettingsSummary
