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
import LinearProgress from 'material-ui/LinearProgress';
import { redA400 } from 'material-ui/styles/colors';

const LoadingBar = (props) => {
  const { generic } = props.loading
  return (
    generic ? <LinearProgress style={{position: 'absolute', top: 0, height: '2px'}} color={redA400} mode="indeterminate" /> : <div></div>
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
