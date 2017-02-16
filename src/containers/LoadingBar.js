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
