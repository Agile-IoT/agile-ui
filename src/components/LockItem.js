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
const getArrayArgsListItems = (args) => {
  return args.map((arg, i) => {
    return (<ListItem key={`arg_${i}`}>
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
const getArgsListItems = (args) => {
  let itemList = [];
  for (var arg in args) {
    if(arg !== 'deleteButton' && arg !== 'not') {
      itemList.push(<ListItem key={`${arg}`}>
          {arg}: {
          Array.isArray(args[arg]) ?
            (<List>{getArrayArgsListItems(args[arg])}</List>) :
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
      <ListItem key={`${i}`}>
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
const getListItems = (locks, policyName) => {
  if(locks) {
    return locks.map((lock, i) => {
      return (
        <ListItem key={`${i}_${lock.op}`}>
          {`${lock.op}`}
          {(<List>
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
    <Card
      style={{marginBottom: '20px'}}>
      <CardHeader
        actAsExpander={props.actAsExpander}
        showExpandableButton={props.showExpandableButton}
        title={props.title}
        subtitle={props.subtitle}
      />
      <CardText expandable>
        <List>{getListItems(props.policy.flows, props.title)}</List>
      </CardText>
      <CardActions>
        {props.policy.buttons}
      </CardActions>
    </Card>);
};

export default LockItem
