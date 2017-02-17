import React, { Component } from 'react';
import { Device } from '../components';
import { FlatButton } from 'material-ui';
import { connect } from 'react-redux';
import agileSDK from 'agile-sdk';
import { devicesFetch, devicesDelete } from '../actions';

class Devices extends Component {

  renderActions(device) {
    return (
      <div>
        <FlatButton label='Delete' onClick={() => {this.props.devicesDelete(device.deviceId)}} />
        <FlatButton label='View Data' onClick={() => { console.log('hiii!')}} />
        <FlatButton label='Connect' onClick={() => { console.log('hiii!')}} />
      </div>
    )
  }

  renderItems(devices) {
    if (devices) {
      return devices.map((device, i) => {
        return(
          <Device
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
    this.props.devicesFetch()

    const agile = agileSDK('/api');
    const deviceId = 'bleB0B448BE5084';
    const componentID = 'Temperature';

    agile.device.subscribe(deviceId, componentID).then(stream => {
      stream.onerror = () => {
        console.log('Connection Error');
      };

      stream.onopen = () => {
        console.log('Connected');
      };

      stream.onclose = () => {
        console.log('Closed');
      };

      stream.onmessage = (e) => {
        if (typeof e.data === 'string') {
            console.log("Received: '" + e.data + "'");
        }
      };
    }).catch(err => {
      console.log(err);
    });
  }

  render() {
    return (
      <div>
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
    devicesFetch: () => dispatch(devicesFetch()),
    devicesDelete: (id) => dispatch(devicesDelete(id))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Devices);
