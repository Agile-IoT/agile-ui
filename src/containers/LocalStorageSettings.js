import React, { Component } from 'react';
import { connect } from 'react-redux';
import { LocStorSettingsSummary } from '../components';

import { 
  locStorPolicyAdd,
  locStorPolicyDelete,
  locStorPoliciesFetch,
} from '../actions';

class LocalStorageSettings extends Component {
  constructor(props) {
    super(props) 
    this.state = {
      deviceId: props.device.deviceId,
      streams: props.device.streams,
      interval: 3000, 
      selectedComponent: props.device.streams[0].id
    }
  }

  componentDidMount() {
    this.props.locStorPoliciesFetch(this.props.device.deviceId);
  }

  handleIntervalChange = (event, value) => this.setState({interval: value})
  handleComponentChange = (event, key, value) => this.setState({selectedComponent: value})
  handleButtonClick = () => {
    this.props.locStorPolicyAdd(this.state.deviceId, this.state.selectedComponent, this.state.interval)
  }

  render() {
    const {
      localStorage,
      locStorPolicyDelete
    } = this.props;
    return (
      <LocStorSettingsSummary
        deviceId={this.state.deviceId}
        streams={this.state.streams}
        interval={this.state.interval}
        selectedComponent={this.state.selectedComponent}

        handleIntervalChange={this.handleIntervalChange}
        handleComponentChange={this.handleComponentChange}
        handleButtonClick={this.handleButtonClick}

        localStorage={localStorage}
        locStorPolicyDelete={locStorPolicyDelete}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    device: state.device,
    localStorage: state.localStorage
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    locStorPolicyAdd: (deviceId, componentId, interval) => dispatch(locStorPolicyAdd(deviceId, componentId, interval)),
    locStorPolicyDelete: (deviceId, componentId) => dispatch(locStorPolicyDelete(deviceId, componentId)),
    locStorPoliciesFetch: (deviceId, componentId) => dispatch(locStorPoliciesFetch(deviceId, componentId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LocalStorageSettings);
