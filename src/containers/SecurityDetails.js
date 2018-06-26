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
import React, {Component} from 'react';

import {
  setEntityData,
  deleteAttribute,
  canExecuteActions,
  resetPassword,
  updatePassword,
  newPasswordInput,
  oldPasswordInput,
  setInputName,
  setInputValue
} from '../actions';
import {connect} from 'react-redux';
import recursiveKeys from 'recursive-keys';
import deepdiff from 'deep-diff';
import { ListItem } from 'material-ui/List';
import {FloatingActionButton} from 'material-ui';
import {Link} from 'react-router';
import Done from 'material-ui/svg-icons/action/done'
import TextField from 'material-ui/TextField';
import ContentEdit from 'material-ui/svg-icons/editor/mode-edit'
import SecurityItem from '../components/SecurityItem';

const ACTIONS = ['write'];

const styles = {
  title: {
    fontSize: '1rem'
  },
  passwordFieldStyle: {
    position: 'absolute',
    right: 50,
    top: 10
  }, 
  groupButtonStyle: {
    position: 'absolute',
    right: 600,
    top: 10
  }
}

class SecurityDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userName: props.entity.user_name,
      entityId: props.entity.id,
      authType: props.entity.auth_type,
      entityType: props.entity.type
    }
  }

  isPrimitive(object) {
    return (object !== Object(object));
  }

  isHidden(fieldProperties, attribute) {
    return fieldProperties[attribute] && fieldProperties[attribute].hidden;
  }

  isEditable(fieldProperties, attribute) {
    return this.canWrite(attribute) && !(fieldProperties[attribute] && fieldProperties[attribute].notEditable);
  }

  canWrite(attribute) {
    attribute = attribute ? attribute : 'actions.self';
    return (this.props.entityActionsPolicies.policies
      && this.props.entityActionsPolicies.policies[attribute]
      && this.props.entityActionsPolicies.policies[attribute].write)
  }

  updatePasswordField() {
    return (
      <div style={styles.passwordFieldStyle}>
        <Done
          style={{
            float: 'right',
            marginRight:'20px',
            cursor: 'pointer'
          }} 
          onClick={(event) => {
            event.stopPropagation();
            this.props.updatePassword(this.props.input.old_password, this.props.input.new_password);
            this.props.oldPasswordInput('');
            this.refs.old_password.value = '';
            this.props.newPasswordInput('');
            this.refs.new_password.value = '';
          }}
        />
        <TextField
          hintText={'New Password'}
          ref='new_password'
          id={'new_password'}
          style={{
            width: '30%',
            marginRight:'15px',
            float: 'right'
          }}
          onBlur={(data) => {
            this.props.newPasswordInput(data.target.value)
          }}
        />
        <TextField
          hintText={'Old Password'}
          id={'old_password'}
          ref='old_password'
          style={{
            width: '30%',
            marginRight:'15px',
            float: 'right'
          }}
          onBlur={(data) => {
            this.props.oldPasswordInput(data.target.value)
          }}
        />
      </div>
    )
  }

  resetPasswordField() {
    return (
      <div style={styles.passwordFieldStyle}>
        <TextField
          hintText={'New Password'}
          ref='new_password'
          id={'new_password'}
          style={{
            width: '30%',
            marginRight:'15px',
            float: 'right'
          }}
          onBlur={(data) => {
            this.props.newPasswordInput(data.target.value)
          }}
        />

        <Done
          style={{
            float: 'right',
            marginRight:'20px',
            cursor: 'pointer'
          }} 
          onClick={(event) => {
            event.stopPropagation();
            this.props.resetPassword(this.props.entity.user_name,
            this.props.entity.auth_type, this.props.input.new_password);
            this.props.newPasswordInput('');
            this.refs.new_password.value = '';
          }}
        />
      </div>
    )
  }

  getPasswordField() {
    if (this.props.entityType.replace('/', '') === 'user') {
      if (this.canWrite('password')) {
        if (this.props.entity.id !== this.props.currentUser.id) {
          return this.resetPasswordField();
        }
        return this.updatePasswordField();
      }
    }
  }

  addAttribute(id, type) {
    if (this.props.input.input_name !== '') {
      const inputValue = this.props.input.input_value !== '' ? this.props.input.input_value : {};
      const params = {
        entityId: id,
        entityType: type.replace('/', ''),
        attributeType: this.props.input.input_name,
        attributeValue: inputValue
      };
      this.props.setEntityAttributes(params);
      this.props.setInputName('');
      this.props.setInputValue('');
    }
  }

  addAttributeField(id, type, parent) {
    const handleOnBlur = (event) => {
      const inputName = parent
        ? parent + '.' + event.target.value
        : event.target.value.toString();
      this.props.setInputName(inputName)
    }

    return (
      <ListItem 
        primaryText = {
          <div>
            <TextField
              defaultValue={this.props.input.input_name}
              hintText='New Attribute'
              style={{marginRight: '10%'}}
              onBlur={event => {
                handleOnBlur(event)
              }}
            />
            <TextField
              style={{margin: 'auto'}}
              placeholder='Value'
              onBlur={event =>
                this.props.setInputValue(event.target.value.toString())
              }
            />
          </div>
        }
        rightIcon={<span
          style={{
            float: 'right',
            position: 'initial',
            fontWeight: 'bold',
            width: '10%',
            color: '#008714'
          }}
          onClick={event => { this.addAttribute(id, type) }} 
        > 
          ADD NEW 
        </span>}
      />
    )
  }

  renderGroupEditButton = (id, type, groups) => {
    const groupNames = groups.map(group => {return group.group_name});
    return (
      <div style={styles.groupButtonStyle}>
        {'Groups: ' + groupNames + " "}
        <Link style={{"vertical-align": "sub"}} to={`/group/${id}/${type.replace('/','')}`}>
          <FloatingActionButton 
            mini={true} 
            label='Group'
          >
            <ContentEdit/>
          </FloatingActionButton>
        </Link>
      </div>
    )
  }

  renderDetails(entity, fieldProperties, parent) {
    if (entity) {
      let sortedAttributes = Object.keys(entity);

      sortedAttributes = sortedAttributes.filter((attr) => {
        return !this.isHidden(fieldProperties, attr);
      })

      /*sor attributes. Sort out to have within each attribute the following order:
        primitive attributes before objects
        non editable attributes before editable ones
        if they have the same values for the previously mentioned criteria, then use lexicographical order
      */
      sortedAttributes = sortedAttributes.sort((attr1, attr2) => {
        let editableLast = this.isEditable(fieldProperties,attr1) -this.isEditable(fieldProperties,attr2);
        let objectLast = this.isPrimitive(entity[attr2]) -this.isPrimitive(entity[attr1]);
        if(editableLast === 0){
          if(objectLast === 0){
            return attr1.localeCompare(attr2);
          } else {
            return objectLast;
          }
        }
        else {
          return editableLast;
        }
      })

      return sortedAttributes.map((k) => {
        let attribute = k;
        if (parent) {
          attribute = parent + '.' + k;
        }

        let attributeField = {
          name: fieldProperties[k] && fieldProperties[k].name ? fieldProperties[k].name : k,
          value: this.isPrimitive(entity[k]) ? entity[k] : this.renderDetails(entity[k], fieldProperties, attribute),
          editable: this.isEditable(fieldProperties, attribute)
        };

        //Add addAttributeField if the attribute is a JSON object (or not a primitive)
        if (!this.isPrimitive(attributeField.value) && attributeField.editable) {
          attributeField.addAttributeField = this.addAttributeField(this.props.entity.id, this.props.entityType.replace('/', ''), attribute);
        }

        return attributeField;
      })
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    let difference = deepdiff(this.props.entity, nextProps.entity);
    if (difference) {
      difference = difference.filter(diff => {return diff.kind === 'N'});
      const addedAttributes = difference.map(diff => {return diff.path.join('.')});
      if(addedAttributes.length > 0) {
        const attribute_names = recursiveKeys.dumpKeysRecursively(this.props.entity).concat(addedAttributes);
        this.props.canExecuteActions(this.props.entity.id, this.props.entityType.replace('/', ''), attribute_names, ACTIONS);
      }
    }
    return true;
  }

  componentDidMount() {
    this.props.canExecuteActions(this.props.entity.id, this.props.entityType.replace('/', ''),
      recursiveKeys.dumpKeysRecursively(this.props.entity), ACTIONS);
    this.props.setInputName('');
    this.props.setInputValue('');
    this.props.oldPasswordInput('');
    this.props.newPasswordInput('');
  }

  render() {
    const {entity, entityType, title, subtitle, fieldProperties, entityActionsPolicies} = this.props;
    const styledTitle = (<span style={styles.title}>{title}</span>)
    if (entity && entityActionsPolicies) {
      return (<SecurityItem
        expandable
        showExpandableButton
        key={entity.id + '_' + entityType}
        title={styledTitle}
        subtitle={subtitle}
        entity={entity}
        entityType={entityType.replace('/', '')}
        addAttributeField={(parent) => {
          return this.addAttributeField(entity.id, entityType, parent)
        }}
        attributes={this.renderDetails(entity, fieldProperties)}
        dataChanged={this.props.setEntityAttributes}
        passwordField={this.getPasswordField()}
        groupField={entity.groups ? this.renderGroupEditButton(entity.id, entityType, entity.groups) : null}
        handleDelete={this.props.deleteAttribute}
      />)
    }
  }
}

const mapStateToProps = (state) => {
  return {
    entityActionsPolicies: state.entityPolicies,
    schemas: state.schemas,
    currentUser: state.currentUser,
    entityList: state.entityList,
    input: state.input
  };
};

const
  mapDispatchToProps = (dispatch) => {
    return {
      setEntityAttributes: (params) => dispatch(setEntityData(params)),
      deleteAttribute: (params) => dispatch(deleteAttribute(params)),
      canExecuteActions: (id, type, attributes, ACTIONS) => dispatch(canExecuteActions(id, type, attributes, ACTIONS)),
      updatePassword: (oldPassword, newPassword) => dispatch(updatePassword(oldPassword, newPassword)),
      resetPassword: (username, authType, newPassword) => dispatch(resetPassword(username, authType, newPassword)),
      oldPasswordInput: (value) => dispatch(oldPasswordInput(value)),
      newPasswordInput: (value) => dispatch(newPasswordInput(value)),
      setInputName: (name) => dispatch(setInputName(name)),
      setInputValue: (value) => dispatch(setInputValue(value))
    };
  };

export default connect(mapStateToProps, mapDispatchToProps)(SecurityDetails);
