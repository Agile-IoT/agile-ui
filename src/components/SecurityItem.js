import React from 'react';
import {
  Card,
  CardText,
  CardHeader
} from 'material-ui/Card';
import {List, ListItem} from 'material-ui/List';
import InlineEdit from 'react-edit-inline';

const isPrimitive = (attribute) => {
  return (attribute !== Object(attribute));
}

const changedData = (id, type, dataChanged, data) => {
  let params = {};
  params.entityId = id;
  params.entityType = type;
  for (var attribute in data) {
    if (data.hasOwnProperty(attribute)) {
      params.attributeType = attribute;
      try {
        params.attributeValue = JSON.parse(data[attribute]);
      } catch (err) {
        params.attributeValue = data[attribute];
      }
    }
  }

  dataChanged(params);
}

const getInlineEditField = (id, type, key, value, dataChanged, ui, parent, deleteButton, editLock) => {
  return (<div key={`${id}${key}`}>
    {ui[key] && ui[key].name ? ui[key].name : key}: {<InlineEdit activeClassName='editing'
                        text={value}
                        change={(data) => changedData(id, type, dataChanged, data)}
                        paramName={parent}
          />
          }
    {editLock}
    {deleteButton}
  </div>);
}

const getNestedField = (id, type, key, attributes, dataChanged, ui, parent, deleteButton, addAttributeField, editLock) => {
  return (<div key={`${id}${key}`}>
    {ui[key] && ui[key].name ? ui[key].name : key}: {renderAttributes(id, type, attributes, addAttributeField, dataChanged, ui, parent)}
    {editLock}
    {deleteButton}
  </div>);
}

const renderEditableAttribute = (id, type, attribute, dataChanged, ui, parent) => {
  parent = parent ? parent + "." + attribute.name : attribute.name;

  if(isPrimitive(attribute.value)) {
    return getInlineEditField(id, type, attribute.name, attribute.value, dataChanged, ui, parent, attribute.deleteButton, attribute.editLock);
  } else {
    return getNestedField(id, type, attribute.name, attribute.value, dataChanged, ui, parent, attribute.deleteButton, attribute.addAttributeField, attribute.editLock);
  }
}

const renderAttribute = (id, type, attribute, dataChanged, ui, parent) => {
  parent = parent ? parent + "." + attribute.name : attribute.name;
  let value = isPrimitive(attribute.value) ? attribute.value :
    renderAttributes(id, type, attribute.value, attribute.addAttributeField, dataChanged, ui, parent);

  return (
    <div key={`${id}${attribute.name}`}>
      {ui[attribute.name] && ui[attribute.name].name ? ui[attribute.name].name : attribute.name}: {value}
    </div>
  );
}

const renderAttributes = (id, type, attributes, addAttributeField, dataChanged, ui, parent) => {
  if (attributes) {
    let attributesRendered = attributes.map((attribute) => {
      if (attribute.editable) {
        return (
          <ListItem id={`${attribute.name}`} key={`${id}${attribute.name}`}>
            {renderEditableAttribute(id, type, attribute, dataChanged, ui, parent)}
          </ListItem>)
      }
      else {
        return (
          <ListItem id={`${attribute.name}`} key={`${id}${attribute.name}`}>
            {renderAttribute(id, type, attribute, dataChanged, ui, parent)}
          </ListItem>)
      }
    });
    return (
      <List>
        {attributesRendered}
        {addAttributeField}
      </List>
    )
  }
}

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
      {props.passwordField}
      {props.groupField}
      <CardText expandable>
        {renderAttributes(props.entity.id, props.entityType, props.attributes, props.addAttributeField, props.ui, props.dataChanged)}
      </CardText>
    </Card>);
};

export default SecurityItem
