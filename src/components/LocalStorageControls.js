import React, { Component } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import { FlatButton } from 'material-ui';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import { List } from 'material-ui/List';
import { GenericListItem } from '../components/GenericListItem';

export class LocalStorageControls extends Component {
  constructor(props) {
    super(props)
    this.state = {
      componentID: '',
      interval: 3000
    }
  }

  handleComponentChange = (event, index, value) => this.setState({componentID: value})
  handleIntervalChange = (event, value) => this.setState({interval: value})

  render() {
    // TODO move upstream, this should not be here.
    let selectedComponentId = this.state.componentID
    if (!selectedComponentId) {
      selectedComponentId = this.props.streams && this.props.streams[0].id
    }

    return(
      <Card>
        <CardHeader
          title={'Local Storage Settings'}
          actAsExpander={this.props.actAsExpander}
          showExpandableButton={this.props.showExpandableButton}
        />
        <CardText expandable>
          <Subheader style={{padding: '0px', fontWeight: 'bold', fontSize: '15px', color: 'black'}}> Add new policy </Subheader>
          <Divider />
          <List>
            <GenericListItem
              leftEl='Device Id'
              rightEl={<code>{this.props.deviceId}</code>}
            />

            <GenericListItem
              leftEl='Component Id'
              rightEl={<SelectField
                value={selectedComponentId}
                onChange={this.handleComponentChange}>
                {this.formatStreams(this.props.streams)}
              </SelectField>}
            />

            <GenericListItem
              leftEl='Interval'
              rightEl={
                <TextField 
                  value={this.state.interval}
                  onChange={this.handleIntervalChange}
                  hintText='Im ms'/> 
              }
            />

            <FlatButton label='Add' onClick={() => {
              this.props.locStorPolicyAdd(
                this.props.deviceId,
                this.state.componentID,
                this.state.interval
              )
            }} />
          </List>

          {this.props.locStorPolicies.length
            ? this.locStorPoliciesSection(this.props.locStorPolicies)
            : null
          }

        </CardText>
      </Card>
    ) 
  }

  locStorPoliciesSection = (policies) => {
    return (
      <List>
        <Subheader style={{padding: '0px', fontWeight: 'bold', fontSize: '15px', color: 'black'}}> Manage existing policies </Subheader>
        <Divider />
        {this.props.locStorPolicies.map(pol => {
          return <GenericListItem
            leftEl={`Device Id: ${pol.deviceID},  Component Id: ${pol.componentID} is polled every ${pol.interval} ms`}
            rightEl={<div onClick={() => {
              this.props.locStorPolicyDelete(pol.deviceID, pol.componentID) 
            }}> ubp </div>}
          > 
          </GenericListItem>
        })}
      </List>
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
