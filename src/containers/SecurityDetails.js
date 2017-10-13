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

import {FloatingActionButton} from 'material-ui';
import {Link} from 'react-router';

import ContentRemove from 'material-ui/svg-icons/content/remove';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentSave from 'material-ui/svg-icons/content/save'
import ContentEdit from 'material-ui/svg-icons/editor/mode-edit'

import SecurityItem from '../components/SecurityItem';

const actions = ['write'];

const deleteButtonStyle = {
  margin: 0,
  top: 2,
  right: 2,
  position: 'absolute'
};
const addButtonStyle = {
  margin: 0,
  top: 2,
  right: 2,
  display: 'inline'
};

const passwordFieldStyle = {
  position: 'absolute',
  right: 50,
  top: 10
}

const groupButtonStyle = {
  position: 'absolute',
  right: 600,
  top: 10
}

class SecurityDetails extends Component {

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

  addAttribute(id, type, inputName, inputValueName) {
    if (this.props.input.input_name !== '') {
      let inputValue = this.props.input.input_value !== '' ? this.props.input.input_value : {};
      let params = {
        entityId: id,
        entityType: type,
        attributeType: this.props.input.input_name,
        attributeValue: inputValue
      };
      this.props.setEntityAttributes(params);
      this.props.setInputName('');
      this.refs[inputName].value = '';
      this.props.setInputValue('');
      this.refs[inputValueName].value = '';
    }
  }

  updatePasswordField() {
    return (
      <div style={passwordFieldStyle}>
        <input ref='old_password' type='password' placeholder='Old password' onBlur={event => {
          this.props.oldPasswordInput(event.target.value)
        }}/>

        <input ref='new_password' type='password' placeholder='New Password' onBlur={event =>
          this.props.newPasswordInput(event.target.value)}/>

        <FloatingActionButton mini={true} style={addButtonStyle}
                              label='Save'
                              onClick={event => {
                                event.stopPropagation();
                                this.props.updatePassword(this.props.input.old_password, this.props.input.new_password);
                                this.props.oldPasswordInput('');
                                this.refs.old_password.value = '';
                                this.props.newPasswordInput('');
                                this.refs.new_password.value = '';
                              }}>
          <ContentSave/>
        </FloatingActionButton>
      </div>
    )
  }

  resetPasswordField() {
    return (
      <div style={passwordFieldStyle}>
        <input ref='new_password' placeholder='New Password' onBlur={event =>
          this.props.newPasswordInput(event.target.value)}/>

        <FloatingActionButton mini={true} style={addButtonStyle}
                              label='Save'
                              onClick={event => {
                                event.stopPropagation();
                                this.props.resetPassword(this.props.entity.user_name,
                                  this.props.entity.auth_type, this.props.input.new_password);
                                this.props.newPasswordInput('');
                                this.refs.new_password.value = '';
                              }}>
          <ContentSave/>
        </FloatingActionButton>
      </div>
    )
  }

  getPasswordField() {
    if (this.props.entityType.replace('/', '') === 'user') {
      if (this.canWrite('password')) {
        if (this.props.entity.id !== this.props.currentUser.id) {
          return this.resetPasswordField();
        } else {
          return this.updatePasswordField();
        }
      }
    }
  }

  addAttributeField(id, type, parent) {
    const inputNameField = parent + '_name';
    const inputValueField = parent + '_value';
    return (
      <div>
        <input ref={inputNameField} defaultValue={this.props.input.input_name} placeholder='New Attribute' onBlur={event => {
          const inputName = parent ? parent + '.' + event.target.value : event.target.value.toString();
          this.props.setInputName(inputName)
        }}/>

        <input ref={inputValueField} placeholder='Value' onBlur={event =>
          this.props.setInputValue(event.target.value.toString())}/>

        <FloatingActionButton mini={true} style={addButtonStyle}
                              label='Add'
                              onClick={event => {
                                this.addAttribute(id, type, inputNameField, inputValueField)
                              }}>
          <ContentAdd/>
        </FloatingActionButton>
      </div>
    )
  }

  renderDeleteButton = (id, type, attribute) => {
    return (
      <FloatingActionButton mini={true} id={'delete_' + id + '_' + attribute}
                            key={id + '_' + attribute}
                            style={deleteButtonStyle}
                            label='Delete'
                            onClick={() => {
                              this.props.deleteAttribute({id: id, type: type, attribute: attribute})
                            }}>
        <ContentRemove/>
      </FloatingActionButton>
    )
  }

  renderGroupEditButton = (id, type, groups) => {
    const groupNames = groups.map(group => {return group.group_name});
    return (
      <div style={groupButtonStyle}>
        {'Groups: ' + groupNames + " "}
        <Link style={{"vertical-align": "sub"}} to={`/group/${id}/${type.replace('/','')}`}>
          <FloatingActionButton mini={true} label='Group'><ContentEdit/></FloatingActionButton>
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
          name: k,
          value: this.isPrimitive(entity[k]) ? entity[k] : this.renderDetails(entity[k], fieldProperties, attribute),
          editable: this.isEditable(fieldProperties, attribute)
        };

        //Add deleteButton if we can write to the attribute
        if (attributeField.editable) {
          attributeField.deleteButton = this.renderDeleteButton(this.props.entity.id, this.props.entityType.replace('/', ''), attribute);
        }

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
        this.props.canExecuteActions(this.props.entity.id, this.props.entityType.replace('/', ''), attribute_names, actions);
      }
    }
    return true;
  }

  componentDidMount() {
    this.props.canExecuteActions(this.props.entity.id, this.props.entityType.replace('/', ''),
      recursiveKeys.dumpKeysRecursively(this.props.entity), actions);
    this.props.setInputName('');
    this.props.setInputValue('');
    this.props.oldPasswordInput('');
    this.props.newPasswordInput('');
  }

  render() {
    const {entity, entityType, title, subtitle, fieldProperties, entityActionsPolicies} = this.props;
    if (entity && entityActionsPolicies) {
      return (<SecurityItem
        expandable
        showExpandableButton
        key={entity.id + '_' + entityType}
        title={title}
        subtitle={subtitle}
        entity={entity}
        entityType={entityType.replace('/', '')}
        addAttributeField={this.addAttributeField(entity.id, entityType)}
        attributes={this.renderDetails(entity, fieldProperties)}
        dataChanged={this.props.setEntityAttributes}
        passwordField={this.getPasswordField()}
        groupField={entity.groups ? this.renderGroupEditButton(entity.id, entityType, entity.groups) : null}
        ui={fieldProperties}
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
      canExecuteActions: (id, type, attributes, actions) => dispatch(canExecuteActions(id, type, attributes, actions)),
      updatePassword: (oldPassword, newPassword) => dispatch(updatePassword(oldPassword, newPassword)),
      resetPassword: (username, authType, newPassword) => dispatch(resetPassword(username, authType, newPassword)),
      oldPasswordInput: (value) => dispatch(oldPasswordInput(value)),
      newPasswordInput: (value) => dispatch(newPasswordInput(value)),
      setInputName: (name) => dispatch(setInputName(name)),
      setInputValue: (value) => dispatch(setInputValue(value))
    };
  };

export default connect(mapStateToProps, mapDispatchToProps)(SecurityDetails);