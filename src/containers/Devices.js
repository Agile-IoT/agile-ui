import React, { Component } from 'react';
import { DeviceItem } from '../components';
import { FlatButton } from 'material-ui';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { devicesAndStreamsFetch, devicesDelete } from '../actions';

class Devices extends Component {

  renderActions(device) {
    return (
      <div className='devices'>
        <FlatButton label='Delete' onClick={() => {
          this.props.devicesDelete(device.deviceId)}
        } />
        <Link to={`/graphs/${device.deviceId}`}>
          <FlatButton label='View Data' />
        </Link>
        <Link to={`/devices/${device.deviceId}`}>
          <FlatButton label='Configure' />
        </Link>
      </div>
    )
  }

  renderItems(devices) {
    if (devices) {
      return Object.keys(devices).map((deviceId, i) => {
        const device = devices[deviceId]

        return(
          <DeviceItem
            expandable
            showExpandableButton
            key={i}
            title={device.name}
            subtitle={device.deviceId}
            status={device.status}
            actions={this.renderActions(device)}
            meta={device}
          />)
      })
    }
  }

  componentDidMount() {
    this.props.devicesAndStreamsFetch()
  }

  render() {
    return (
      <div className="devices">
        {this.renderItems(this.props.devices)}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    devices: state.devices
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    devicesAndStreamsFetch: () => dispatch(devicesAndStreamsFetch()),
    devicesDelete: (deviceId) => dispatch(devicesDelete(deviceId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Devices);
