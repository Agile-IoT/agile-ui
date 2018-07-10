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
import {groupsFetch} from '../actions'
import GroupItem from "../components/GroupItem";

class GroupMembers extends Component {
  render() {
    const group = this.props.groups.find(group =>
      group.owner === this.props.params.owner &&
      group.group_name === this.props.params.group_name)

    if (group && group.entities) {
      let id = group.group_name + '-' + group.owner
      id = id.replace(/!@!/g, '-')
      return (
        <GroupItem
          id={id}
          title={group.group_name}
          owner={group.owner}
          group={group}
          text={group.entities.map(entity => JSON.stringify(entity))}
        />
      )
    }
    return (<div>No group members</div>)
  }

  componentWillMount() {
    this.props.groupsFetch()
  }
}

const mapStateToProps = (state) => {
  return {
    groups: state.groups
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    groupsFetch: () => dispatch(groupsFetch())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupMembers)
