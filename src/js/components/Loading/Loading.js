import React, { Component, PropTypes } from 'react'
import FontIcon from 'material-ui/FontIcon'
import RefreshIndicator from 'material-ui/RefreshIndicator'

export default class Loading extends Component {

  style = {
    left: '50%',
    transform: 'translate(-50%, 0)',
    top: '0 !important'
  }

  render () {
    return (
      <RefreshIndicator
        size={80}
        top={50}
        left={0}
        status="loading"
        loadingColor={"#FF9800"}
        style={this.style}
      />
    )
  }
}
