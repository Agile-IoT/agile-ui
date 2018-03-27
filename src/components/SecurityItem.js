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
import { RaisedButton } from 'material-ui';
import { Card, CardText, CardHeader } from 'material-ui/Card';
import { List, ListItem } from 'material-ui/List';
import TextField from 'material-ui/TextField';
import RemoveIcon from 'material-ui/svg-icons/action/delete-forever'

const helpers = {
  _isPrimitive: (attribute) => {
    return (attribute !== Object(attribute));
  },

  _abbreviate: (value) => {
    const max = 15
    if (value.length > max) {
      value = `${value.substring(0, max)}...`
    }
    return <span style={{float: 'right'}}> {value} </span>
  }
}

const SecurityItem = (props) => {
  const { entityType, attributes, addAttributeField, handleDelete, handleSectionDelete } = props
  const { id } = props.entity

  const getNestedField = ({
      id,
      entityType,
      name,
      value,
      addAttributeField,
      parent,
      editLock
    }) => {
      const nestedElement = renderAttributes({
        id,
        entityType,
        attributes: value,
        addAttributeField,
        parent
      })

      const styles = {
        title: {
          fontWeight: 'bold',
          fontSize: '1.2rem'
        },
        hint: {
          color: '#8a8a8a',
          marginLeft: '5%',
          fontWeight: 'bold'
        }
      }
      return (
        <ListItem key={`${id}${name}`}
          style={{backgroundColor: '#eaeaea'}}
          primaryTogglesNestedList={true}
          nestedItems={[
            <div>
              {nestedElement}
              {editLock}
            </div>
          ]}
        >
          <span style={styles.title}> {name} section </span>
          <span style={styles.hint}> click to expand... </span>
        </ListItem>
      );
  }

  const renderEditableAttribute = ({
      id,
      entityType,
      attribute,
      addAttributeField,
      parent
    }) => {

    const { value, name, deleteButton, editLock } = attribute

    parent = parent
      ? `${parent}.${name}`
      : attribute.name;

    const baseArguments = { id, entityType, name, value, parent, deleteButton, editLock }
    return helpers._isPrimitive(value)
      ? getInlineEditField(baseArguments)
      : getNestedField(Object.assign(baseArguments, { addAttributeField }))
  }

  const renderAttribute = ({id, entityType, attribute, addAttributeField, parent}) => {
      const { name, value } = attribute
      const nestedElement = helpers._isPrimitive(attribute.value)
        ? helpers._abbreviate(value)
        : renderAttributes({
          id,
          entityType,
          attributes: value,
          addAttributeField,
          parent
      });

      return (
        <div key={`${id}${name}`}>
          <span style={{float: 'left'}}>{name}</span>: {nestedElement}
        </div>
      );
  }

  const renderAttributes = ({ id, entityType, attributes, addAttributeField, parent }) => {
      if (!attributes) {
        return
      }
      const styles= {
        borderStyle: {
          borderWidth: '1px',
          borderColor: '#bcbcbc',
          borderStyle: 'solid'
        }
      }

      const toRender = attributes.map(attribute => {
        const handlerFunction = attribute.editable
          ? renderEditableAttribute
          : renderAttribute

        return <ListItem
          disabled
          id={`${attribute.name}`}
          key={`${id}${attribute.name}`}>
            {handlerFunction({id, entityType, attribute, addAttributeField, parent})}
          </ListItem>
      })

      return (
        <List style={styles.borderStyle}>
          {toRender}
          {addAttributeField(parent)}
          {parent ?
            <RaisedButton
              backgroundColor='#ff7878'
              style={{
                padding: '5px'
              }}
              label='REMOVE SECTION'
              labelStyle={{
                fontWeight: 'bold'
              }}
              fullWidth={true}
              onClick={() => {
                handleDelete({
                  id: id,
                  type:entityType,
                  attribute: parent
                })
              }}
            />
          : null}
        </List>
      )
  }

  // TODO EDIT LOCK
  const getInlineEditField = ({ id, entityType, name, parent, value, editLock }) => {
    const field = <TextField
      defaultValue={value}
      style={{
        float: 'right',
        marginRight: '30px'
      }}

      onBlur={data => {
        const payload = {
          entityId: id,
          entityType,
          attributeType: parent,
          attributeValue: data.target.value
        }
        props.dataChanged(payload)
      }}
    />

    const removeButtonStyle = {
      cursor: "pointer",
      float: "right"
    }

    const removeIcon = <RemoveIcon
      style={removeButtonStyle}
      onClick={() => {
        handleDelete({
          id,
          type:entityType,
          attribute: parent
        })
      }}
    />

    return (
      <ListItem key={`${id}${name}`}>
        {removeIcon}
        {name}:{field}
        {editLock}
      </ListItem>
    )
  }

  return (
    <Card style={{ }}>
      <CardHeader
        actAsExpander
        showExpandableButton={props.showExpandableButton}
        title={props.title}
        subtitle={props.subtitle}
      />
      {props.passwordField}
      {props.groupField}
      <CardText expandable>
        {renderAttributes({
          id,
          entityType,
          attributes,
          addAttributeField,
          handleSectionDelete
        })}
      </CardText>
    </Card>);
};

export default SecurityItem
