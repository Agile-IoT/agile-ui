/*******************************************************************************
 *Copyright (C) 2017 Resin.io, FBK, Jolocom.
 *All rights reserved. This program and the accompanying materials
 *are made available under the terms of the Eclipse Public License v1.0
 *which accompanies this distribution, and is available at
 *http://www.eclipse.org/legal/epl-v10.html
 *
 *Contributors:
 *    Resin.io, FBK, Jolocom - initial API and implementation
 ******************************************************************************/
import React from 'react';
import { connect } from 'react-redux';
import LinearProgress from 'material-ui/LinearProgress';
import { redA400 } from 'material-ui/styles/colors';

const LoadingBar = (props) => {
  const { loading } = props
  return (
    loading ? <LinearProgress style={{position: 'absolute', top: 0, height: '2px'}} color={redA400} mode="indeterminate" /> : <div></div>
  )
};

function mapStateToProps(state) {
  return {
    loading: state.loading
  }
}

export default connect(
  mapStateToProps,
)(LoadingBar)
