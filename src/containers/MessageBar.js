import React from 'react';
import { connect } from 'react-redux';
import Snackbar from 'material-ui/Snackbar';
import { messageRemove } from '../actions';
const MESSAGE_INTERVAL = 4000

// This app takes care displaying messages and errors to the user
const renderBar = (message) => {
  let open = true
  return (
    <Snackbar
      open={open}
      message={message}
      autoHideDuration={MESSAGE_INTERVAL}
    />
  )
}

const MessageBar = (props) => {
  const { messages, messageRemove } = props
  // return snack bar if message exists
  const hasMessages = messages.length > 0
  const latestMessage = messages[messages.length - 1]
  
  if (hasMessages) {
    setTimeout(() => {
      messageRemove(latestMessage)
    }, MESSAGE_INTERVAL);
  }
  return (
    hasMessages ? renderBar(latestMessage, messageRemove) : <div></div>
  )
}

const mapStateToProps = (state) => {
  return {
    messages: state.messages
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    messageRemove: (msg) => dispatch(messageRemove(msg)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MessageBar)
