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
import React, {Component} from 'react'
import {connect} from 'react-redux'
import Form from 'react-jsonschema-form'
import {entityFetch, groupsFetch, addToGroup, removeFromGroup} from '../actions'

let changeGroupSchema = {
  title: 'Change group of entity',
  type: 'object',
  required: [
    'groups',
    'id',
    'type'
  ],
  properties: {
    id: {
      type: 'string',
      title: 'Entity ID'
    },
    type: {
      type: 'string',
      title: 'Entity Type'
    },
    groups: {
      type: 'array',
      title: 'Groups',
      items: {
        type: 'string',
        enum: []
      }
    }
  }
}

const uiSchema = {
  id: {'ui:readonly': true},
  type: {'ui:readonly': true}
}

class Group extends Component {
  componentDidMount() {
    this.props.entityFetch(this.props.params.type)
    this.props.groupsFetch()
  }

  addToGroups(groups, entity) {
    if(groups.length) {
      groups.forEach(group_name => {
        const group = this.props.groups.find(group => 
          group_name === group.group_name)

        if(group) {
          this.props.addToGroup(
            group.owner,
            group_name,
            entity.type.replace('/', ''),
            entity.id
          )
        }
      })
    }
  }

  removeFromGroups(groups, entity) {
    if(groups.length) {
      groups.forEach(group_name => {
        const group = this.props.groups.find(group => 
          group_name === group.group_name)

        if(group) {
          this.props.removeFromGroup(
            group.owner,
            group_name,
            entity.type.replace('/', ''),
            entity.id
          )
        }
      })
    }
  }

  setGroups(entityGroups, entity) {
    let addToGroups = []
    let removeFromGroups = []

    if(entity.groups) {
      entityGroups.forEach(group_name => {

        const notMember = !entity.groups.some(group =>
          group.group_name === group_name)

        const doesNotExist = !addToGroups.some(groupname =>
          group_name === groupname)

        if(notMember && doesNotExist) {
          addToGroups.push(group_name)
        }
      })

      removeFromGroups = entity.groups.filter(group =>
        entityGroups.indexOf(group.group_name) === -1
      ).map(group =>
        group.group_name
      )
    } else if(entityGroups.length) {
      addToGroups = entityGroups
    }

    this.addToGroups(addToGroups, entity)
    this.removeFromGroups(removeFromGroups, entity)
  }


  getGroupFormData(entity) {
    const formData = JSON.parse(JSON.stringify(entity))
    if(entity.groups) {
      formData.groups = entity.groups.map(entityGroup => {
        const group = this.props.groups.find(group =>
          group.group_name === entityGroup.group_name
        )

        return group ? group.group_name : undefined
      })
    }

    return formData
  }

  render() {
    const entity = this.props.entityList.find(entity =>
      entity.id === this.props.params.id && 
      entity.type.replace('/', '') === this.props.params.type)

    if (entity && this.props.groups) {
      changeGroupSchema.properties.groups.items.enum = this.props.groups
        .map(group => group.group_name)

      const formData = this.getGroupFormData(entity)

      return (
        <div>
          <Form 
            schema={changeGroupSchema}
            uiSchema={uiSchema}
            onSubmit={e => {
              this.setGroups(e.formData.groups, entity)
            }}
            formData={formData}
            onError={e => console.log('ERROR', e)}/>
        </div>
      )
    }
    return (<div>Entity data not found</div>)
  }
}

const mapStateToProps = (state) => {
  return {
    entityList: state.entityList,
    groups: state.groups
  }
}

const
  mapDispatchToProps = (dispatch) => {
    return {
      entityFetch: (id, type, actions) => dispatch(entityFetch(id, type, actions)),
      groupsFetch: () => dispatch(groupsFetch()),
      addToGroup: (owner, groupname, type, id) => dispatch(addToGroup(owner, groupname, type, id)),
      removeFromGroup: (owner, groupname, type, id) => dispatch(removeFromGroup(owner, groupname, type, id)),

    }
  }

export default connect(mapStateToProps, mapDispatchToProps)(Group)
