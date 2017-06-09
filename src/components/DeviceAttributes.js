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
import ActionInfo from 'material-ui/svg-icons/action/info';
import {
  redA400,
  greenA700,
} from 'material-ui/styles/colors';

const colorCode = {
  AVAILABLE: greenA700,
  UNAVAILBLE: redA400
}

const weights = {id:0, type:1, owner:2};

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
        <Link to={`/devices/${deviceId}`} >
        <FlatButton label = 'Add Attribute'/>
        </Link>
      </div>
    )
}

const renderAttributes = (id, entity) => {
  var e = Object.assign({}, entity);
  delete e.credentials;
  var it =  Object.keys(e);
  it = it.sort((a, b) => {
    var wa = weights.hasOwnProperty(a)?weights[a]:10;
    var wb = weights.hasOwnProperty(b)?weights[b]:10;
    return wa - wb;
  });

  return it.map((k) => {
    if(weights.hasOwnProperty(k)){
      return (
        <ListItem  key={`${id}${k}${e[k]}`} primaryText={`${k} : ${e[k]}`}/>
      )
    }
    else{
      return (
        <ListItem key={`${id}${k}${e[k]}`}  primaryText={`${k} : ${e[k]}`}  rightIconButton={buildInfoButton(id,k)} />
      )
    }

  });

}

const DeviceAttributes = (props) => {
  return (
    <Card>
      <CardHeader
        title={`Attributes`}
        subtitle={`${props.type.toString().substring(1)} attributes`}
        actAsExpander={props.actAsExpander}
        showExpandableButton={props.showExpandableButton}
        avatar={
          <Avatar
            icon={<ActionInfo />}
          />}
      />
      <CardText expandable>
        <List>
          {renderAttributes(props.id, props.entity)}
        </List>
      </CardText>
      <CardActions>
        <div>
          {renderActions()}
        </div>
      </CardActions>
    </Card>
  );
}


export default DeviceAttributes
