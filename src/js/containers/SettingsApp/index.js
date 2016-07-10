import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Settings } from '../../components'

class SettingsApp extends Component {
  static propTypes = {
    settings: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    error: PropTypes.object
  }

  constructor(props) {
    super(props)
  }

  render () {
    const { open, dispatch, settings, error } = this.props
    return (
      <Settings open={open} settings={settings} dispatch={dispatch} error={error}  />
    )
  }
}

function mapStateToProps(state) {
  return {
    settings: state.settings.items,
    open: state.settings.open,
    error: state.settings.error
  }
}

function mapDispatchToProps (dispatch) {
  return {
    dispatch:dispatch
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsApp)
