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
import {Tabs, Tab} from 'material-ui/Tabs';
import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import {fetchCurrentUser, fetchEntitySchemas} from '../actions';
import {connect} from 'react-redux';

class Nav extends Component {
  handleActive(tab) {
    browserHistory.push(tab.props.value);
  }

  componentDidMount() {
    this.props.fetchEntitySchemas();
    this.props.fetchCurrentUser();
  }

  getTabs() {
    if (this.props.schemas.schema && this.props.schemas.ui && this.props.schemas.ui.entities) {
      return this.props.schemas.schema.filter(schema => {
        const ui = this.props.schemas.ui.entities[schema.id] ? this.props.schemas.ui.entities[schema.id] : {};
        return !ui.hidden;
      }).map(schema => {
        const ui = this.props.schemas.ui.entities[schema.id] ? this.props.schemas.ui.entities[schema.id] : {};
        return (
          <Tab key={schema.id}
               label={ui.name ? ui.name : schema.id}
               value={"/list" + schema.id}
               onActive={this.handleActive.bind(this)}
          >
          </Tab>)
      })
    }
  }

  render() {
    const tabMap = {
      '/': '/',
      '/devices': '/devices',
      '/entity': '/entity',
      '/graphs': '/graphs',
      '/recommender': '/recommender'
    }

    return(
      <Tabs id={`navigation`} value={tabMap[this.props.location.pathname]}>
        <Tab label="Discover"
             value="/"
             onActive={this.handleActive.bind(this)}
        >
        </Tab>
        <Tab label="Devices"
             value="/devices"
             onActive={this.handleActive.bind(this)}
        >
        </Tab>
        <Tab label="User profile"
             value={`/entity/${this.props.currentUser.id}/user`}
             onActive={this.handleActive.bind(this)}
        >
        </Tab>
        <Tab label="Recommender"
             value={"/recommender"}
             onActive={this.handleActive.bind(this)}
        >
        </Tab>
        {this.getTabs()}
      </Tabs>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.currentUser,
    schemas: state.schemas
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchCurrentUser: () => dispatch(fetchCurrentUser()),
    fetchEntitySchemas: () => dispatch(fetchEntitySchemas())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Nav);
