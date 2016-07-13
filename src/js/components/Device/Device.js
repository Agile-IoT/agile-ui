import React, { Component, PropTypes } from 'react'
import { Card } from 'material-ui/Card'
import DeviceBasicInfo from './DeviceBasicInfo'
import Loading from '../Loading/Loading'
import DeviceStream from './DeviceStream'


export default class Device extends Component {

  static propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    path: PropTypes.string,
    loading: PropTypes.string,
    streams: PropTypes.array,
    actions: PropTypes.object
  }

  renderStreams() {
    if (this.props.streams)
      return this.props.streams.map((stream, index) =>
        (
          <DeviceStream
            key={index}
            id={stream.id}
            unit={stream.unit}
            value={45}
            />
        )
      )
    return
  }

  render () {
    return (
      <div>
        <Card>
          <Loading loading={this.props.loading} />
          <DeviceBasicInfo
            id={this.props.id}
            name={this.props.name}
            path={this.props.path}
          />
        </Card>
      {this.renderStreams()}
      </div>


    )
  }
}
