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
import React, {Component} from 'react';
import {EntityItem} from '../components';
import {FlatButton} from 'material-ui';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {entityDeleteByType, entityFetch} from '../actions';

class Entities extends Component {

  renderNewEntityButton() {
    return (
      <div>
        <Link id={`new_entity_button`} to={`/add/${this.props.params.type.replace('/', '')}`}>
          <FlatButton label={`Add new ${this.props.params.type.replace('/', '')}`}/>
        </Link>
      </div>
    )
  }

  renderActions(entity) {
    let id = entity.id || entity.group_name
    switch (this.props.params.type) {
      case 'group':
        return (
          <div>
            <Link id={`delete_${id}`}>
              <FlatButton label='Delete' onClick={() => {
                this.props.entityDelete(entity, this.props.params.type);
              }}/>
            </Link>
            <Link id={`view_${id}`} to={`/group/${entity.group_name}`}>
              <FlatButton label='View members'/>
            </Link>
          </div>
        )
      default:
        return (
          <div>
            <Link id={`delete_${id}`}>
              <FlatButton label='Delete' onClick={() => {
                this.props.entityDelete(entity, this.props.params.type);
              }}/>
            </Link>
            <Link id={`view_${id}`} to={`/entity/${entity.id}/${this.props.params.type}`}>
              <FlatButton label='View'/>
            </Link>
            <Link id={`group_${id}`} to={`/group/${entity.id}/${this.props.params.type}`}>
              <FlatButton label='Group'/>
            </Link>
            <Link id={`policies_${id}`} to={`/locks/${entity.id}/${this.props.params.type}`}>
              <FlatButton label='Policies'/>
            </Link>
          </div>
        )
    }
  }

  renderItems() {
    if (this.props.entityList) {
      return this.props.entityList.map((entity, i) => {
        let id = entity.id || entity.group_name
        return (
          <EntityItem
            id={id.replace('!@!', '-')}
            title={entity.id || entity.group_name}
            key={entity.id || entity.group_name}
            status={entity.status}
            actions={this.renderActions(entity)}
            meta={entity}
          />)
      });
    }

    return 'Entity list is empty'
  }

  componentWillMount() {
    this.props.entityFetch(this.props.params.type);
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.props.entityFetch(this.props.params.type)
    }
  }

  render() {
    const addnewExists = this.props.ui &&
      this.props.ui['/' + this.props.params.type] &&
      Object.keys(this.props.ui['/' + this.props.params.type]).includes('addNew');

    return (
      <div>
        {this.renderItems()}
        {(addnewExists && this.props.ui['/' + this.props.params.type].addNew) || !addnewExists
          ? this.renderNewEntityButton()
          : undefined
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    entityList: state.entityList,
    ui: state.schemas.ui
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    entityFetch: (type) => dispatch(entityFetch(type)),
    entityDelete: (entity, type) => dispatch(entityDeleteByType(entity, type))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Entities);
