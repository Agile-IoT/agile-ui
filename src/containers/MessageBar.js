/*******************************************************************************
 *Copyright (C) 2017 Resin.io, FBK, Jolocom.
 *All rights reserved. This program and the accompanying materials
 *are made available under the terms of the Eclipse Public License 2.0
 *which accompanies this distribution, and is available at
 *https://www.eclipse.org/legal/epl-2.0/
 *
 *SPDX-License-Identifier: EPL-2.0
 *
 *Contributors:
 *    Resin.io, FBK, Jolocom - initial API and implementation
 ******************************************************************************/
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
