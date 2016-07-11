import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Device } from '../../components'

class DeviceApp extends Component {

  static propTypes = {
    device: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  componentWillMount () {
    this.updateDevice(this.props)
  }

  updateDevice(props) {
    const id = props.location.pathname.split("/").pop()
    props.dispatch({type: 'DEVICE_FETCH_REQUESTED', method: 'GET',
      resource: '/devices', device: id })
  }

  render () {
    const { device: { item, loading, error }, dispatch } = this.props
    return (
      <div>
        <Device name={item.name} id={item.id} path={item.path}
        dispatch={dispatch} loading={loading} error={error} />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    device: state.device
  }
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch: dispatch
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeviceApp)
