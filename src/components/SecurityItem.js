import React from 'react';
import {
  Card,
  CardText,
  CardHeader
} from 'material-ui/Card';


const SecurityItem = (props) => {
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
        {props.details}
      </CardText>
    </Card>);
};

export default SecurityItem