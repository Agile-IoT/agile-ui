import React from 'react';
import isEmpty from 'lodash/isEmpty';
import { List, ListItem } from 'material-ui/List';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import { FlatButton } from 'material-ui';
import DatePicker from 'material-ui/DatePicker';

import {
  Card,
  CardActions,
  CardHeader,
  CardText,
} from 'material-ui/Card';

import Avatar from 'material-ui/Avatar';

import {
  redA400,
  greenA700,
} from 'material-ui/styles/colors';

const colorCode = {
  AVAILABLE: greenA700,
  UNAVAILBLE: redA400
}

const computeColor = (status) => {
  return colorCode[status]
}

const renderMeta = (meta, id) => {
  if (meta) {
    const keys = Object.keys(meta).filter(i => i !== 'streams');
    return keys.map((key, i) => {
      return (
        <ListItem key={`${id}-${key}`}>
          {key}: <code>{!isEmpty(meta[key]) ? JSON.stringify(meta[key]) : 'null'}</code>
        </ListItem>
      )
    })
  }
}

class Device extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      interval : 3000,
      componentID : '',
      cloudCompID: '',
      startDate: new Date(),
      endDate: new Date()
    }
  }

  handleComponentChange = (event, index, value) => this.setState({componentID: value})
  handleCloudCompChange = (event, index, value) => this.setState({cloudCompID: value})
  handleIntervalChange = (event, value) => this.setState({interval: value})
  handleStartDateChange = (event, date) => this.setState({startDate: date})
  handleEndDateChange = (event, date) => this.setState({endDate: date})

  shouldDisableDate = (date) => {
    const now = new Date()
    const inFuture = date > now
    const tooFarBack = Math.floor((now - date) / (1000 * 3600 * 24)) > 3
    return inFuture || tooFarBack
  }

  render() {
    return (
      <div>
      <Card>
        <CardHeader
          title={this.props.title}
          subtitle={this.props.subtitle}
          actAsExpander={this.props.actAsExpander}
          showExpandableButton={this.props.showExpandableButton}
          avatar={
            <Avatar
              backgroundColor={computeColor(this.props.status)}
              >{this.props.title && this.props.title.charAt(0)}
            </Avatar>}
        />
        <CardText expandable>
          <List>
            {renderMeta(this.props.meta, this.props.subtitle)}
          </List>
        </CardText>
        <CardActions>
          {this.props.actions}
        </CardActions>
      </Card>
      
      <Card>
        <CardHeader
          title={'Local Storage Settings'}
          actAsExpander={this.props.actAsExpander}
          showExpandableButton={this.props.showExpandableButton}
        />
        <CardText expandable>
          <List>
            <ListItem>
              DeviceID: <code>{this.props.subtitle}</code>
            </ListItem>

            <ListItem>
              ComponentID: 
              <DropDownMenu
                value = {this.state.componentID}
                onChange={this.handleComponentChange}
              >
                {this.props.meta.streams ? this.props.meta.streams.map(s => { return <MenuItem value={s.id} primaryText={s.id} />}) : null}
              </DropDownMenu>
            </ListItem>

            <ListItem>
              Interval: <
                TextField 
                value={this.state.interval}
                onChange={this.handleIntervalChange}
                hintText='Im ms'
              /> 
            </ListItem>

            <ListItem>
              <FlatButton label='Add' onClick={() => {
                this.props.locStorSubscribe(this.props.subtitle, this.state.componentID, this.state.interval)
              }} />
            </ListItem>

            <FlatButton label='Existing subscriptions' onClick={() => {this.props.getLocStorSubs(this.props.subtitle, this.state.componentID)}} />
          </List>
        </CardText>
      </Card>

      <Card>
        <CardHeader
          title={'Upload to cloud'}
          actAsExpander={this.props.actAsExpander}
          showExpandableButton={this.props.showExpandableButton}
        />

        <CardText expandable>
          <List>
            <ListItem>
            Provider:
            <DropDownMenu value = {this.state.cloudCompID}>
              <MenuItem primaryText='Dropbox'/>
              <MenuItem primaryText='Google'/>
              <MenuItem primaryText='Fitbit'/>
            </DropDownMenu>
            </ListItem>

            <ListItem>
            ComponentID:
            <DropDownMenu
              value = {this.state.cloudCompID}
              onChange={this.handleCloudCompChange}>
                {this.props.meta.streams
                  ? this.props.meta.streams.map(s =>
                  <MenuItem value={s.id} primaryText={s.id} />) 
                  : null
                }
            </DropDownMenu>
            </ListItem>

            <ListItem>
              Period:
              <DatePicker 
                hintText="From"
                autoOk
                mode="landscape" 
                shouldDisableDate={this.shouldDisableDate}
                defaultDate={this.state.startDate}
                onChange={this.handleStartDateChange}
              />
              <DatePicker 
                hintText="Untill"
                autoOk
                mode="landscape" 
                shouldDisableDate={this.shouldDisableDate}
                defaultDate={this.state.endDate}
                onChange={this.handleEndDateChange}
              />

              <FlatButton label='Upload' onClick={() => this.props.cloudUploadData(
                this.props.subtitle,
                this.state.cloudCompID,
                this.state.startDate,
                this.state.endDate,
                'Google')}
               />
            </ListItem>
          </List>
        </CardText>

        <CardActions>
          {this.props.actions}
        </CardActions>
      </Card>

      </div>
    );
  }
}

export default Device
