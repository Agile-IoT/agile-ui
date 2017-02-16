import React, { Component } from 'react';
import { connect } from 'react-redux';
import { discoveryToggle, drawerToggle, protocolsFetch, discoveryStatus } from '../actions';
import { SettingsMenu } from '../components';

class Settings extends Component {
  componentDidMount() {
    this.props.protocolsFetch()
    this.props.discoveryStatus()
  }

  render() {
    return (
      <SettingsMenu
        {...this.props}
      />
    )
  }

}

const mapStateToProps = (state) => {
  return {
    discovery: state.discovery,
    drawer: state.drawer,
    protocols: state.protocols
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    drawerToggle: (bool) => dispatch(drawerToggle(bool)),
    discoveryToggle: (bool) => dispatch(discoveryToggle(bool)),
    protocolsFetch: () => dispatch(protocolsFetch()),
    discoveryStatus: () => dispatch(discoveryStatus()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings)
