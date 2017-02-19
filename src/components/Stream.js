import React from 'react';
import moment from 'moment';

import {
  Card,
  CardActions,
  CardHeader,
  CardText,
} from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';


const Stream = (props) => {
  return (
    <Card>
      <CardHeader
        title={props.componentID}
        subtitle={`Last update: ${moment(Number(props.lastUpdate)).fromNow()}`}
        avatar={<Avatar size={40}>{Math.floor(props.value)}</Avatar>}
      />
    </Card>
  );
}

export default Stream;
