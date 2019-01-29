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
import React, { Component } from 'react'
import { connect } from 'react-redux'

import CircularProgress from 'material-ui/CircularProgress'
import IconButton from 'material-ui/IconButton'
import InfoIcon from 'material-ui/svg-icons/action/info-outline.js'
import ShoppingCart from 'material-ui/svg-icons/action/shopping-cart.js'

import { GenericListItem } from '../components/'
import { recommendationsFetch } from '../actions/recommender'

class Recommender extends Component {
  componentDidMount() {
    this.props.recommendationsFetch()
  }

  getStyles() {
    return {
      noDataContainer: {
        width: '100%',
        textAlign: 'center'
      },
      noDataMsg: {
        fontWeight: 'bold',
        color: '#929292',
        fontSize: '1.2rem'
      },
      tooltip: {
        fontSize: '16px'
      },
      infoIcon: {
        marginLeft: '10px',
        marginRight: '10px'
      },
      summaryWrapper: {
        display: 'flex',
        alignItems: 'center'
      },
      listItem: {
        bar: {
          marginBottom: '20px',
          backgroundColor: 'white'
        },
        rightEl: {
          marginRight: '10px'
        }
      }
    }
  }

  generateSummary(record) {
    const styles = this.getStyles()
    const msg = 'This device is recommended to you because it is related to ' +
      'your gateway profile, or used by similar gateways.'

    return (
      <div style={styles.summaryWrapper}>
        <IconButton
          tooltip={msg}
          tooltipPosition="bottom-right"
          tooltipStyles={styles.tooltip}
        >
          <InfoIcon style={styles.infoIcon}/>
        </IconButton>
        {record.title}
      </div>
    )
  }

  generateBuyButton(record) {
    return (
      <IconButton onClick={() => window.open(record.href)}>
        <ShoppingCart />
      </IconButton>
    )
  }

  renderRecommendations() {
    const styles = this.getStyles()
    if (this.props.recommendations.length === 0) {
      return (<div style={styles.noDataContainer}>
        <span style={styles.noDataMsg}>No recommendations available </span>
      </div>)
    }
    return this.props.recommendations.map(rec =>
      <GenericListItem
        leftEl={this.generateSummary(rec)}
        rightEl={this.generateBuyButton(rec)}
        style={styles.listItem}
      />
    )
  }

  render() {
    if (this.props.loading.recommender) {
      return (<div className='loadingScreen'>
        <CircularProgress size={250} thickness={10}/>
      </div>)
    }

    return (<div>{this.renderRecommendations()}</div>)
  }
}

const mapStateToProps = (state) => {
  return {
    recommendations: state.recommendations,
    loading: state.loading
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    recommendationsFetch: () => dispatch(recommendationsFetch())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Recommender)
