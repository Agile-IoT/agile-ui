import React from 'react';
import isEmpty from 'lodash/isEmpty';
import { List, ListItem } from 'material-ui/List';

import {
  Card,
  CardActions,
  CardHeader,
  CardText,
} from 'material-ui/Card';

import Avatar from 'material-ui/Avatar';

import {
  redA400,
  greenA700,
} from 'material-ui/styles/colors';

const colorCode = {
  AVAILABLE: greenA700,
  UNAVAILBLE: redA400
}

const computeColor = (status) => {
  return colorCode[status]
}

const renderMeta = (meta, id) => {
  if (meta) {
    const keys = Object.keys(meta).filter(i => i !== 'streams');
    return keys.map((key, i) => {
      return (
        <ListItem key={`${id}-${key}`}>
          {key}: <code>{!isEmpty(meta[key]) ? JSON.stringify(meta[key]) : 'null'}</code>
        </ListItem>
      )
    })
  }
}

const Device = (props) => {
  return (
    <Card>
      <CardHeader
        title={props.title}
        subtitle={props.subtitle}
        actAsExpander={props.actAsExpander}
        showExpandableButton={props.showExpandableButton}
        avatar={
          <Avatar
            backgroundColor={computeColor(props.status)}
            >{props.title && props.title.charAt(0)}</Avatar>}
      />
      <CardText expandable>
        <List>
          {renderMeta(props.meta, props.subtitle)}
        </List>
      </CardText>
      <CardActions>
        {props.actions}
      </CardActions>
    </Card>
  );
}


export default Device
