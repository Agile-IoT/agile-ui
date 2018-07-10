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
import {
  Card,
  CardActions,
  CardHeader,
  CardText
} from 'material-ui/Card';
import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';

const stringConstructor = "".constructor;
const arrayConstructor = [].constructor;
const objectConstructor = {}.constructor;
const styles = {
  borderStyle: {
    borderWidth: '1px',
    borderColor: '#bcbcbc',
    borderStyle: 'solid'
  }
}

function getType(object) {
  if (object === null) {
    return 'null';
  } else if (object === undefined) {
    return 'undefined';
  } else if (!isNaN(parseFloat(object)) && !isNaN(object - 0) ) {
    return 'Number'
  } else if (object.constructor === stringConstructor) {
    return 'String';
  } else if (object.constructor === arrayConstructor) {
    return 'Array';
  } else if (object.constructor === objectConstructor) {
    return 'Object';
  } else {
    return 'unknown';
  }
}

function getOrder(object) {
  switch(getType(object)) {
    case 'null':
      return 0
    case 'undefined':
      return 1
    case 'Number':
      return 2
    case 'String':
      return 3
    case 'Array':
      return 4
    case 'Object':
      return 5
    default:
      return 6
  }
}

function compare (a, b) {
  if (getOrder(a) < getOrder(b)) {
    return -1
  } else if (getOrder(a) > getOrder(b)) {
    return 1
  }
  return 0
}

JSON.sort = function(object) {
  const keys = Object.keys(object)
  const sortedKeys = keys.sort((a, b) => {
    return compare(object[a], object[b])
  })
  let sortedObject = {}
  for(let index in sortedKeys){
    let key = sortedKeys[index];
    sortedObject[key] = object[key];
  }
  return sortedObject
}

const renderAttribute = (key, value, parent) => {
  if (getType(value) === 'Array') {
    return (
      <List
        id={`${parent + '-' + key}`}
        key={`${parent + '-' + key}`}>
        <span style={{float: 'left'}}>{key}</span>:
        {renderAttributes(value, parent + '-' + key)}
      </List>
    )
  } else if (getType(value) === 'Object') {
    if (getType(key) === 'Number') {
      return (<List
        id={`${parent + '-' + key}`}
        key={`${parent + '-' + key}`}>
        {renderAttributes(value, parent + '-' + key)}
      </List>)
    } else {
      return (<List
        id={`${parent + '-' + key}`}
        key={`${parent + '-' + key}`}>
        <span style={{float: 'left'}}>{key}</span>:
        {renderAttributes(value, parent + '-' + key)}
      </List>)
    }
  } else {
    return (
      <div id={`${parent + '-' + key}`}
           key={`${parent + '-' + key}`}>
        <span style={{float: 'left'}}>{key}</span>: {value}
      </div>
    )
  }
}

const renderAttributes = (group, parent) => {
  group = JSON.sort(group)
  if (!group) {
    return
  }

  return (<List style={styles.borderStyle}>
    {Object.entries(group).map(attribute => {
      const key = attribute[0]
      const value = attribute[1]
      return (<ListItem
        id={`${parent + '-' + key}`}
        key={`${parent + '-' + key}`}>
        {renderAttribute(key, value, parent)}
      </ListItem>)
    })}
  </List>)
}

const GroupItem = (props) => {
  return (
    <Card
      id={props.id}
      style={{marginBottom: '20px'}}>
      <CardHeader
        actAsExpander
        showExpandableButton={true}
        title={props.title}
        subtitle={props.owner}
        avatar={
          <Avatar>{props.title && props.title.charAt(0)}</Avatar>
        }
      />
      <CardText expandable>
        {renderAttributes(props.group, 'root')}
      </CardText>
      <CardActions>
        {props.actions}
      </CardActions>
    </Card>
  );
}


export default GroupItem
