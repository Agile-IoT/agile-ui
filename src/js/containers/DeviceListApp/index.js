import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { DeviceList } from '../../components'

class DeviceListApp extends Component {
  static propTypes = {
    deviceList: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)
  }

  componentDidMount () {
    this.updateList(this.props)
  }

  componentWillUpdate (nextProps) {
    // detect if route has changed and load new device resource
    if (nextProps.location.pathname != this.props.location.pathname) {
      this.updateList(nextProps)
    }
  }

  updateList(props) {
    let resource
    if (props.location.pathname === '/') {
      resource = '/devices'
    } else {
      resource = '/protocols/devices'
    }
    props.dispatch({type: 'DEVICELIST_FETCH_REQUESTED', method: 'GET', resource: resource })
  }

  render () {
    const { deviceList: { items, loading }, dispatch, route } = this.props
    return (
      <div>
        <DeviceList listName={route.title} loading={loading} devices={items} dispatch={dispatch} />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    deviceList: state.deviceList
  }
}

function mapDispatchToProps (dispatch) {
  return {
    dispatch: dispatch
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeviceListApp)
