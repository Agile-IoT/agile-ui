import React, { Component } from 'react';
import { Credentials, DeviceAttributes } from '../components';
import { FlatButton } from 'material-ui';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { credentialsFetch } from '../actions';

class DeviceSecurity extends Component {

  renderAttributes(device) {
    if (device.credentials) {
      return(
        <DeviceAttributes
          expandable
          showExpandableButton
          entity={device}
          id={this.props.params.deviceId}
          type={device.type}
        />
      )

    }
  }

  renderCredentials(device) {
    if (device.credentials) {
      return(
        <Credentials
          expandable
          showExpandableButton
          cred={device.credentials}
          id={this.props.params.deviceId}
          type={device.type}
        />
      )

    }
  }

  componentDidMount() {
    this.props.credentialsFetch(this.props.params.deviceId)
  }

  render() {
    return (
      <div>
        {this.renderAttributes(this.props.credentials)}
        {this.renderCredentials(this.props.credentials)}
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
    credentialsFetch: (deviceId) => dispatch(credentialsFetch(deviceId)),

  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeviceSecurity);
