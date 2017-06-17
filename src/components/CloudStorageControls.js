import React from 'react';
import SelectField from 'material-ui/SelectField';
import DatePicker from 'material-ui/DatePicker';
import MenuItem from 'material-ui/MenuItem';
import { Card, CardHeader, CardText, } from 'material-ui/Card';
import { List } from 'material-ui/List';
import { FlatButton } from 'material-ui';
import { GenericListItem } from '../components/GenericListItem';

export class CloudStorageControls extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      componentID: '',
      startDate: new Date(),
      endDate: new Date()
    }
  }

  shouldDisableDate = (date) => {
    const now = new Date()
    const inFuture = date > now
    const tooFarBack = Math.floor((now - date) / (1000 * 3600 * 24)) > 3
    return inFuture || tooFarBack
  }

  handleStartDateChange = (event, date) => this.setState({startDate: date})
  handleEndDateChange = (event, date) => this.setState({endDate: date})
  handleCloudCompChange = (event, index, value) => this.setState({componentID: value})

  render() {
    // TODO move upstream, this should not be here.
    let selectedComponentId = this.state.componentID
    if (!selectedComponentId) {
      selectedComponentId = this.props.streams && this.props.streams[0].id
    }

    return(
      <Card>
        <CardHeader
          title={'Upload to cloud'}
          actAsExpander={this.props.actAsExpander}
          showExpandableButton={this.props.showExpandableButton}
        />

        <CardText expandable>
          <List>
            <GenericListItem
              leftEl='Storage Provider'
              rightEl= {
                <SelectField value = {this.state.componentID}>
                  <MenuItem primaryText='Dropbox'/>
                  <MenuItem primaryText='Google'/>
                  <MenuItem primaryText='Fitbit'/>
                </SelectField>
              }
            />

            <GenericListItem
              leftEl='Component Id'
              rightEl={
                <SelectField
                  value = {selectedComponentId}
                  onChange={this.handleCloudCompChange}
                >
                {this.formatStreams(this.props.streams)}
              </SelectField>}
            />

            <GenericListItem
              leftEl='Start Date'
              rightEl={
                <DatePicker 
                  hintText="From"
                  textFieldStyle={{width: '100%'}}
                  autoOk
                  mode="landscape" 
                  shouldDisableDate={this.shouldDisableDate}
                  defaultDate={this.state.startDate}
                  onChange={this.handleStartDateChange}
                />
              }
            />

            <GenericListItem
              leftEl='End Date'
              rightEl={
                <DatePicker 
                  hintText="Untill"
                  textFieldStyle={{width: '100%'}}
                  autoOk
                  mode="landscape" 
                  shouldDisableDate={this.shouldDisableDate}
                  defaultDate={this.state.endDate}
                  onChange={this.handleEndDateChange}
                />
              }
            />

            <FlatButton label='Upload' onClick={() => this.props.cloudUploadData(
              this.props.deviceId,
              this.state.componentID,
              this.state.startDate,
              this.state.endDate,
              'Google')}
             />
          </List>
        </CardText>
      </Card>
    ) 
  }

  formatStreams(streams) {
    if(streams) {
      return streams.map(s => {
        return <MenuItem value={s.id} primaryText={s.id} />
      }) 
    } 
  }
}
