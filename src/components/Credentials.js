import React from 'react';
import isEmpty from 'lodash/isEmpty';
import {
  Card,
  CardActions,
  CardHeader,
  CardText,
} from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import { List, ListItem } from 'material-ui/List';
import { Link } from 'react-router';
import { FlatButton } from 'material-ui';
import { FloatingActionButton } from 'material-ui';
import  ImageEdit from 'material-ui/svg-icons/image/edit';
import ActionLock from 'material-ui/svg-icons/action/lock';


const buildInfoButton = (id, key) => {
  return (
    <FloatingActionButton mini={true} href={`/devices/${id}`} >
      <ImageEdit />
    </FloatingActionButton>
  )
}

const renderActions = (deviceId) => {
    return (
      <div>
        <Link to={`/devices/${deviceId}/credential/`} >
          <FlatButton label = 'Add Credentials' />
        </Link>
      </div>
    )
}

const renderCredentials = (id, credentials) => {
  return Object.keys(credentials).map((k) => {
    return (
        <ListItem key={`${id}${k}${credentials[k]}`}  primaryText={`${k} : ${credentials[k]}`}  rightIconButton={buildInfoButton(id,k)} />
    )
  });

}

const Credentials = (props) => {

  return (
    <Card>
      <CardHeader
        title={`Credentials`}
        subtitle={`${props.type.toString().substring(1)} credentials`}
        actAsExpander={props.actAsExpander}
        showExpandableButton={props.showExpandableButton}
        avatar={
          <Avatar icon={<ActionLock />} />
        }
      />
      <CardText expandable>
        <List>
          {renderCredentials(props.id, props.cred)}
        </List>

      </CardText>
      <CardActions>
        {renderActions(props.id)}
      </CardActions>
    </Card>


  );
}


export default Credentials
