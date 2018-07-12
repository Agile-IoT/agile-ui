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

const groupDelimiter = ' | '

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
      },
      uniqueItems: true
    }
  }
}

const uiSchema = {
  id: {'ui:readonly': true},
  type: {'ui:readonly': true},
  groups: {
    'ui:widget': 'checkboxes',
    'ui:options': {
      inline: true
    }
  }
}

class Group extends Component {
  componentDidMount() {
    this.props.entityFetch(this.props.params.type)
    this.props.groupsFetch()
  }

  addToGroups(groups, entity) {
    if (groups.length) {
      groups.forEach(group => {

        if (group) {
          this.props.addToGroup(
            group.owner,
            group.name,
            entity.type.replace('/', ''),
            entity.id
          )
        }
      })
    }
  }

  removeFromGroups(groups, entity) {
    if (groups.length) {
      groups.forEach(group => {

        if (group) {
          this.props.removeFromGroup(
            group.owner,
            group.group_name,
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

    entityGroups.forEach(group => {
      const group_name = group.split(groupDelimiter)[0]
      const owner = group.split(groupDelimiter)[1]

      let member = false
      if(entity.groups) {
        member = entity.groups.some(group =>
          group.owner === owner &&
          group.group_name === group_name)
      }

      const duplicate = addToGroups.some(group =>
        owner === group.owner &&
        group_name === group.group_name)

      if (!member && !duplicate) {
        addToGroups.push({name: group_name, owner: owner})
      }
    })
    if(entity.groups) {
      removeFromGroups = entity.groups.filter(existingGroup =>
        entityGroups.indexOf(existingGroup.group_name + groupDelimiter + existingGroup.owner) === -1
      )
    }
    this.addToGroups(addToGroups, entity)
    this.removeFromGroups(removeFromGroups, entity)
  }


  getGroupFormData(entity) {
    const formData = JSON.parse(JSON.stringify(entity))
    if (entity.groups) {
      formData.groups = entity.groups.map(entityGroup => {
        const group = this.props.groups.find(group =>
          group.owner === entityGroup.owner &&
          group.group_name === entityGroup.group_name
        )

        return group ? group.group_name + groupDelimiter + group.owner : undefined
      })
    }

    return formData
  }

  render() {
    const entity = this.props.entityList.find(entity =>
      entity.id === this.props.params.id &&
      entity.type.replace('/', '') === this.props.params.type)

    if (entity && this.props.groups && this.props.groups.length > 0) {
      changeGroupSchema.properties.groups.items.enum = this.props.groups
        .map(group => group.group_name + groupDelimiter + group.owner)
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
