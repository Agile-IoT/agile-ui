import React, { Component, PropTypes } from 'react'
import FontIcon from 'material-ui/FontIcon'
import RefreshIndicator from 'material-ui/RefreshIndicator'

export default class NoResults extends Component {

  style = {
    left: '50%',
    transform: 'translate(-50%, 0)',
    top: '0 !important'
  }

  static propTypes = {
    text: PropTypes.string.isRequired
  };
  render () {
    return (
      <div className="test--center">
        <FontIcon className="material-icons">sentiment_very_dissatisfied</FontIcon>
        <h3>{this.props.text}</h3>
      </div>
    )
  }
}
