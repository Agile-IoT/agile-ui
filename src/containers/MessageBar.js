import React, { Component } from 'react';
import { connect } from 'react-redux';
import Snackbar from 'material-ui/Snackbar';

// This app takes care displaying messages and errors to the user
const renderBar = (message) => {
  return (
    <Snackbar
      open
      message={message}
      autoHideDuration={4000}
    />
  )
}
const MessageBar = (props) => {
  const { messages } = props
  // return snack bar is message exists
  return (
    messages.length > 0 ? renderBar(messages[0]) : <div></div>
  )
}

const mapStateToProps = (state) => {
  return {
    messages: state.messages
  }
};

export default connect(
  mapStateToProps,
)(MessageBar)
