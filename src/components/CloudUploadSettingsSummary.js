import React from 'react';
import SelectField from 'material-ui/SelectField';
import DatePicker from 'material-ui/DatePicker';
import MenuItem from 'material-ui/MenuItem';
import { Card, CardHeader, CardText, } from 'material-ui/Card';
import { List } from 'material-ui/List';
import { FlatButton } from 'material-ui';
import { GenericListItem } from '../components';

const CloudUploadSettingsSummary = (props) => {
  const fullwidth = {
    width: '100%'
  }

  return(
    <Card>
      <CardHeader
        title={'Upload to cloud'}
        actAsExpander
        showExpandableButton
      />

      <CardText expandable>
        <List>
          <GenericListItem
            leftEl='Storage Provider'
            rightEl={
              <SelectField
                value={props.selectedProvider}
                onChange={props.handleProviderChange}
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
            leftEl='Component Id'
            rightEl={
              <SelectField
                value={props.selectedComponent}
                onChange={props.handleComponentChange}
              >
              {formatStreams(props.streams)}
            </SelectField>}
          />

          <GenericListItem
            leftEl='Start Date'
            rightEl={
              <DatePicker 
                hintText="From"
                textFieldStyle={fullwidth}
                autoOk
                mode="landscape" 
                shouldDisableDate={shouldDisableDate}
                value={props.startDate}
                onChange={props.handleStartDateChange}
              />
            }
          />

          <GenericListItem
            leftEl='End Date'
            rightEl={
              <DatePicker 
                hintText="Untill"
                textFieldStyle={fullwidth}
                autoOk
                mode="landscape" 
                shouldDisableDate={shouldDisableDate}
                value={props.endDate}
                onChange={props.handleEndDateChange}
              />
            }
          />

          <FlatButton
            style={fullwidth}
            label='Upload'
            onClick={props.handleButtonClick}
          />
        </List>
      </CardText>
    </Card>
  ) 
}

// TODO Retention period from Agile data.
const shouldDisableDate = (date) => {
  const retentionPeriod = 3
  const msInDay = 1000 * 3600 * 24

  const now = new Date()
  const inFuture = date > now
  const tooFarBack = Math.floor((now - date) / msInDay) > retentionPeriod 
  return inFuture || tooFarBack
}

const formatStreams = (streams) => {
  return streams.map(s => {
    return <MenuItem value={s.id} primaryText={s.id} />
  })
}

export default CloudUploadSettingsSummary
