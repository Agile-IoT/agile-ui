import React, { Component } from 'react';
import { Credentials, DeviceAttributes } from '../components';
import { FlatButton } from 'material-ui';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { setDeviceAttribute } from '../actions';
import TextField from 'material-ui/TextField';

class DeviceCredential extends Component {


  renderActions(deviceId) {
    if (deviceId) {
      return(
        <div>
          <FlatButton label='Save' onClick={() => {this.props.setDeviceAttribute(deviceId, this.refs.Name.getValue(),  this.refs.Value.getValue())}} />
        </div>
      )
    }
  }

  componentDidMount() {
  }

  render() {
    return (
      <div>
        <TextField
          ref="Name"
          hintText="Credential for"

        /><br />
        <br />
        <TextField
          ref="Value"
          hintText="Credential Value"
        /><br />
        <br />
        {this.renderActions(this.props.params.deviceId)}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    credentials: state.credentials
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setDeviceAttribute: (deviceId, credentialName, credentialValue) => dispatch(setDeviceAttribute(deviceId,`credentials.${credentialName}`,credentialValue)),

  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeviceCredential);
