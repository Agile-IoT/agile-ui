
import React from 'react';

import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import { FlatButton } from 'material-ui';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import { connect } from 'react-redux';

import { Card } from 'material-ui/Card';

import {
  devicesCreate,
  deviceTypesFetch,
  protocolsFetch,
  deviceTypesGet
} from '../actions';

class RegisterDeviceManually extends React.Component {
  constructor() {
    super();

    this.state = {
      open: false,
      deviceStatus: "AVAILABLE",
      deviceProtocol: null,
      deviceName: null,
      deviceId: null,
      deviceType: null,
      deviceTypesMenuItem: []
    };
    this.handleDeviceValueChange = this.handleDeviceValueChange.bind(this);
    this.submitManualDeviceForm = this.submitManualDeviceForm.bind(this);
    this.handleChangeDeviceType = this.handleChangeDeviceType.bind(this);
    this.handleChangeDeviceProtocol = this.handleChangeDeviceProtocol.bind(this);
    this.renderDeviceTypeItems = this.renderDeviceTypeItems.bind(this);
  }

  componentDidMount() {
    this.props.protocolsFetch()
  }

  handleDeviceValueChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleChangeDeviceProtocol(event, index, value) {
    this.setState({
      deviceProtocol: value
    })
    this.renderDeviceTypesSelectList(false)
    this.renderDeviceTypeItems(value)
  }

  handleChangeDeviceType (event, index, value) {
    this.setState({
      deviceType: value
    })
  }

  renderDeviceTypeItems(value) {
    let device = {
      id: this.state.deviceId,
      name: this.state.deviceName,
      protocol: value,
      status: this.state.deviceStatus
    }
    console.log(device)
    deviceTypesGet(device)
    .then(deviceTypes => {
      console.log(deviceTypes)
      
      deviceTypes.map((type, i) => {
        return this.state.deviceTypesMenuItem.push(<MenuItem
          key={type}
          value={type}
          primaryText={type}
        />)} )
    })
    .catch(err => {
      console.log(err)
    });
    // this.renderDeviceTypes(device, this.props.deviceTypes[device.id])
  }

  renderDeviceTypesSelectList(disable) {
    return(
      <div style={{padding: '0px', margin:'0px'}}>
        <SelectField
          required
          name="deviceType"
          floatingLabelText="Device Type"
          value={this.state.deviceType}
          fullWidth={true}
          onChange={this.handleChangeDeviceType}
          // disabled={disable}
        >
          <MenuItem value={null} label="Device Type" primaryText="Select device type" />
          {this.state.deviceTypesMenuItem}
        </SelectField>
      </div>)
  }

  renderProtocols() {
    return(
      <div style={{padding: '0px', margin:'0px'}}>
        <SelectField
          required
          name="deviceProtocol"
          floatingLabelText="Protocol"
          value={this.state.deviceProtocol}
          onChange={this.handleChangeDeviceProtocol}
          fullWidth={true}
        >
          <MenuItem value={this.state.deviceProtocol} label="Protocol" primaryText="Select Protocol" />
          {this.props.protocols.map((protocol, i) => {
            return (<MenuItem
              key={protocol.dbusInterface}
              value={protocol.dbusInterface}
              primaryText={protocol.name}
            />)
          })}
        </SelectField>
      </div>)
  }

  deviceForm() {
    return (
      <form>
        <div style={modalWinStyle.form.group}>
          <TextField
            required
            name="deviceId"
            hintText="Address"
            floatingLabelText="Device Address"
            floatingLabelFixed={true}
            fullWidth={true}
            onChange={this.handleDeviceValueChange}
            // errorText="Required"
            value={this.state.deviceId}
          />
        </div>
        <div style={modalWinStyle.form.group}>
          <TextField
            required
            hintText="Name"
            name="deviceName"
            floatingLabelText="Name"
            floatingLabelFixed={true}
            fullWidth={true}
            onChange={this.handleDeviceValueChange}
            // errorText="Required"
            value={this.state.deviceName}
          />
        </div>
        <div style={modalWinStyle.form.group}>
          {this.renderProtocols()}
        </div>
        <div style={modalWinStyle.form.group}>
          {this.renderDeviceTypesSelectList(true)}
        </div>
      </form>)
  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  submitManualDeviceForm() {
    console.log(this.state)
    let device = {
      id: this.state.deviceId,
      name: this.state.deviceName,
      protocol: this.state.deviceProtocol,
      status: this.state.deviceStatus
    }
    this.props.devicesCreate(device, this.state.deviceType)
    this.setState({open: false});
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleClose}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        onClick={this.submitManualDeviceForm}
      />,
    ];
    return (
      <Card className='discover' style={modalWinStyle.card}>
          <div style={modalWinStyle.btn} >
            <FlatButton style={modalWinStyle.btn} onClick={this.handleOpen}>Register Device</FlatButton>
          </div>
          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="form-dialog-title"
            title="Register Device"
            actions={actions}
            modal={true}
          >
            {this.deviceForm()}
          </Dialog>
        
      </Card>
    )
  }
}

const modalWinStyle = {
  form: {
    group: {
      width: '100%',
      display: 'block',
      margin: '5px'
    }
  },
  label: {fontSize: '1rem', fontWeight: 'bold'},
  btn: {width: '100%', textAligh: 'center'},
  card: {
    marginBottom: '10px'
  },
}

const mapStateToProps = (state) => {
  return {
    deviceTypes: state.deviceTypes,
    protocols: state.protocols
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    devicesCreate: (device, type) => dispatch(devicesCreate(device, type)),
    deviceTypesFetch: (device) => dispatch(deviceTypesFetch(device)),
    protocolsFetch: () => dispatch(protocolsFetch())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RegisterDeviceManually);