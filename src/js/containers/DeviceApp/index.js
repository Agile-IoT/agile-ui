import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Device, NoResults } from '../../components'
import { bindActionCreators } from 'redux'
import * as deviceActions from '../../actions/device'

class DeviceApp extends Component {

  static propTypes = {
    device: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  }

  render () {
    const { device: { item, loading, error }, actions } = this.props
    if (error) {
      return (<NoResults text='Something went wrong'/>)
    } else if (item.length < 1) {
      return (<NoResults text='No device found'/>)
    } else {
      return (<Device name={item.name} id={item.id} path={item.path} actions={actions} loading={loading} error={error} />)
    }
  }
}

function mapStateToProps(state) {
  return {
    device: state.device
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(deviceActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeviceApp)
