import React, { Component, PropTypes } from 'react'
import RefreshIndicator from 'material-ui/RefreshIndicator'

export default class Device extends Component {

  static propTypes = {
    loading: PropTypes.string.isRequired
  };

  render () {
    return (
      <RefreshIndicator
        size={50}
        left={70}
        top={0}
        status={this.props.loading}
        loadingColor={"#FF9800"}
      />
    )
  }
}
