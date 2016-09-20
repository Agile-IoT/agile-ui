import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Snackbar from 'material-ui/Snackbar'

// This app takes care displaying messages and errors to the user
class MessagesApp extends Component {

  static propTypes = {
    messages: PropTypes.array,
  }

  render () {
    let message = ''
    let open = false
    if (this.props.messages.length > 0) {
      message = this.props.messages[this.props.messages.length - 1]
      open = true
    }
    return (
      <Snackbar
        open={open}
        message={message}
        autoHideDuration={4000}
      />
    )
  }
}

function mapStateToProps(state) {
  return {
    messages: state.messages
  }
}

export default connect(
  mapStateToProps,
)(MessagesApp)
