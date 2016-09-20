import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Settings } from '../../components'
import { bindActionCreators } from 'redux'
import * as settingsActions from '../../actions/settings'

class SettingsApp extends Component {
  static propTypes = {
    discovery: PropTypes.bool.isRequired,
    actions: PropTypes.object.isRequired,
    protocols: PropTypes.object,
    open: PropTypes.bool.isRequired
  }

  render () {
    const { open, actions, discovery, protocols } = this.props
    return (
      <Settings open={open} protocols={protocols} discovery={discovery} actions={actions}  />
    )
  }
}

function mapStateToProps(state) {
  return {
    discovery: state.entities.settings.discovery,
    open: state.entities.settings.open,
    protocols: state.entities.protocols
  }
}

function mapDispatchToProps(dispatch) {
  let actions = {
    drawerToggle: settingsActions.drawerToggle,
    discoveryToggle: settingsActions.discoveryToggle.request
  }
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsApp)
