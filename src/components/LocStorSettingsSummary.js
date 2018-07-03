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
import MenuItem from 'material-ui/MenuItem'
import TextField from 'material-ui/TextField'
import Subheader from 'material-ui/Subheader'
import { FlatButton, Dialog } from 'material-ui'
import { Card, CardHeader, CardText } from 'material-ui/Card'
import { List } from 'material-ui/List'
import Checkbox from 'material-ui/Checkbox'
import { GenericListItem, LocalStoragePolicies, LocalDataOverview } from './'

const styles = {
  button: {
    fontSize: '1rem',
    fontWeight: 'bold'
  },
  span: {
    margin: 'auto'
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
      padding: '0px'
    },
    leftEl: {
      fontSize: '1rem'
    }
  },
  subheader: {
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
    backgroundColor: 'rgb(255, 120, 120)',
    width: '100%'
  }
}

const LocStorSettingsSummary = props => {
  const {
    deviceId,
    streams,
    interval,
    retention,
    policyExists,
    records,
    shouldEncrypt,
    publicKey,
    localStorage,
    locStorPolicyDelete,
    recordsDelete,
    selectedComponent,
    handleComponentChange,
    handleIntervalChange,
    handleRetentionChange,
    handleButtonClick,
    handlePublicKeyChange,
    toggleEncryption,
    renderConfirmScreen,
    closeConfirmScreen
  } = props

  const styledTitle = <span style={styles.title}> MANAGE LOCAL DATA </span>
  if (renderConfirmScreen.render) {
    return ConfirmationDialog({ closeConfirmScreen, renderConfirmScreen })
  }

  return (
    <Card>
      <CardHeader title={styledTitle} actAsExpander showExpandableButton />
      <CardText style={{ backgroundColor: '#f1f1f1' }} expandable>
        <LocalDataOverview records={records} recordsDelete={recordsDelete} deviceId={deviceId} />
        <LocalStoragePolicies policies={localStorage} handleRemoval={locStorPolicyDelete} />
        <Subheader style={styles.subheader}> Add new local storage policy </Subheader>
        <List>
          <GenericListItem style={styles.listItems} leftEl="Device Id" rightEl={<code>{deviceId}</code>} />

          <GenericListItem
            style={styles.listItems}
            leftEl="Component Id"
            rightEl={
              <SelectField value={selectedComponent} onChange={handleComponentChange} style={{ textAlign: 'right' }}>
                {formatStreams(streams)}
              </SelectField>
            }
          />

          <GenericListItem
            style={styles.listItems}
            leftEl="Interval"
            rightEl={
              <TextField
                value={interval}
                onChange={handleIntervalChange}
                inputStyle={{ textAlign: 'right' }}
                hintText="Frequency in MS"
              />
            }
          />

          <GenericListItem
            style={styles.listItems}
            leftEl="Retention"
            rightEl={
              <TextField
                value={retention}
                onChange={handleRetentionChange}
                inputStyle={{ textAlign: 'right' }}
                hintText="Period in days"
              />
            }
          />

          <GenericListItem
            style={styles.listItems}
            leftEl="Encrypt"
            rightEl={<Checkbox onClick={toggleEncryption} checked={shouldEncrypt} />}
          />

          {shouldEncrypt ? (
            <GenericListItem
              style={styles.listItems}
              leftEl="Encryption key"
              rightEl={
                <TextField
                  hintText="Base64 encoded public RSA key"
                  multiLine={true}
                  rows={1}
                  rowsMax={3}
                  value={publicKey}
                  onChange={handlePublicKeyChange}
                />
              }
            />
          ) : null}

          <FlatButton
            style={
              !interval || !retention || policyExists || (shouldEncrypt && !publicKey)
                ? styles.buttonInactive
                : { ...styles.buttonActive, backgroundColor: 'rgba(34, 187, 60, 0.5)' }
            }
            disabled={!interval || !retention || policyExists || (shouldEncrypt && !publicKey)}
            labelStyle={styles.button}
            label="Add"
            onClick={handleButtonClick}
          />
        </List>
      </CardText>
    </Card>
  )
}

const formatStreams = streams => {
  if (streams) {
    return streams.map(s => {
      return <MenuItem key={s.id} value={s.id} primaryText={s.id} />
    })
  }
}

const ConfirmationDialog = props => {
  const { renderConfirmScreen, closeConfirmScreen } = props
  return (
    <Dialog
      open={true}
      title="Conflicting encryption policiess"
      style={{ textAlign: 'center', marginBottom: '1%' }}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <div
        style={{
          margin: '0 3%',
          lineHeight: 1.5
        }}
      >
        {renderConfirmScreen.message}
      </div>
      <GenericListItem
        style={{
          bar: {
            margin: 'auto',
            marginTop: '5%',
            width: '50%',
            backgroundColor: 'white'
          },
          rightEl: {
            margin: '0px',
            padding: '0px'
          }
        }}
        leftEl={<FlatButton label="Continue" style={styles.buttonActive} onClick={renderConfirmScreen.onConfirm} />}
        rightEl={<FlatButton style={styles.buttonInactive} label="Cancel" onClick={closeConfirmScreen} />}
      />
    </Dialog>
  )
}
export default LocStorSettingsSummary
