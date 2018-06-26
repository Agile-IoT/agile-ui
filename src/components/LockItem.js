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
  CardText,
  CardHeader,
  CardActions
} from 'material-ui/Card';
import {List, ListItem} from 'material-ui/List';

/**
 * Get the list of array elements, if the locks' property has an array as arguments,
 * e.g. attrEq, where args = ['role', 'admin'] or similar
 * @param args the array of arguments of a lock
 */
const getArrayArgsListItems = (args, op) => {
  return args.map((arg, i) => {
    return (<ListItem key={`arg_${i}_${op}`}>
        {i}:  {'' + arg}
      </ListItem>
    );
  });
}

/**
 * The properties and values of a lock
 * @param args the lock with all its properties
 * @param lock path of the lock (e.g. actions.write.hasType)
 */
const getArgsListItems = (args, op) => {
  let itemList = [];
  for (var arg in args) {
    if(arg !== 'deleteButton' && arg !== 'not') {
      itemList.push(<ListItem key={`${arg}_${op}`}>
          {arg}: {
          Array.isArray(args[arg]) ?
            (<List key={`list_${arg}_${op}`}>{getArrayArgsListItems(args[arg], op)}</List>) :
            '' + args[arg]
        }
        </ListItem>
      );
    }
  }
  return (<List>{itemList}</List>);
}

/**
 * Render single locks as ListItems
 * @param locks objects of locks (i.e. a policy)
 * @param op the operation (e.g. read/write)
 */
const getLocksListItems = (locks, op) => {
  return locks.map((lock, i) => {
    return (
      <ListItem key={`${op}_${i}`}>
        {getArgsListItems(lock, op + '.' + lock.lock)}
        {lock.deleteButton}
      </ListItem>
    )
  });
}

/**
 * Get the list of policies of an entity
 * @param locks the locks for a policy
 * @param policyName the name of the policy
 */
const getListItems = (id, locks, policyName) => {
  if(locks) {
    return locks.map((lock, i) => {
      return (
        <ListItem key={`${id}_${i}_${lock.op}_${policyName}`}>
          {`${lock.op}`}
          {(<List key={`list_${id}_${i}_${lock.op}_${policyName}`}>
            {getLocksListItems(lock.locks, policyName + '.' + lock.op)}
            {lock.deleteButton}
          </List>)}
        </ListItem>
      )
    });
  }
}

const LockItem = (props) => {
  return (
    <Card id={`${props.id.replace('!@!', '-')}`}
          key={`${props.id.replace('!@!', '-')}`}
          style={{marginBottom: '20px'}}>
      <CardHeader
        actAsExpander={props.actAsExpander}
        showExpandableButton={props.showExpandableButton}
        title={props.title}
        subtitle={props.subtitle}
      />
      <CardText expandable>
        <List key={`${props.id.replace('!@!', '-')}_${props.title}`}>{getListItems(props.id.replace('!@!', '-'), props.policy.flows, props.title)}</List>
      </CardText>
      <CardActions>
        {props.policy.buttons}
      </CardActions>
    </Card>);
};

export default LockItem
