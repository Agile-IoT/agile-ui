import React, {Component} from 'react';

import {setEntityData, deleteAttribute, canExecuteActions, setPassword, setInputName, setInputValue} from '../actions';
import {connect} from 'react-redux';
import recursiveKeys from 'recursive-keys';

import {FloatingActionButton} from 'material-ui';

import ContentRemove from 'material-ui/svg-icons/content/remove';
import ContentAdd from 'material-ui/svg-icons/content/add';

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


class SecurityDetails extends Component {

  isPrimitive(object) {
    return (object !== Object(object));
  }

  isHidden(fieldProperties, attribute) {
    return fieldProperties && fieldProperties.hidden && fieldProperties.hidden.indexOf(attribute) !== -1
  }

  isEditable(fieldProperties, attribute) {
    return this.canWrite(attribute)
      && fieldProperties && fieldProperties.notEditable && fieldProperties.notEditable.indexOf(attribute) === -1;
  }

  canWrite(attribute) {
    attribute = attribute ? attribute : 'actions.self';
    return (this.props.entityActionsPolicies.policies
      && this.props.entityActionsPolicies.policies[attribute]
      && this.props.entityActionsPolicies.policies[attribute].write)
  }

  addAttribute(id, type) {
    if(this.props.input.input_name !== '') {
      let inputValue = this.props.input.input_value !== '' ? this.props.input.input_value : {};
      let params = {entityId: id, entityType: type, attributeType: this.props.input.input_name, attributeValue: inputValue};
      this.props.setEntityAttributes(params);
      this.props.setInputName('');
      this.props.setInputValue('');
    }
  }

  addAttributeField (id, type, parent) {
    return (
      <div>
        <input defaultValue={this.props.input.input_name} placeholder='New Attribute' onBlur={event => {
          const inputName = parent ? parent + '.' + event.target.value : event.target.value.toString();
          this.props.setInputName(inputName)
        }}/>

        <input defaultValue={this.props.input.input_value} placeholder='Value' onBlur={event =>
          this.props.setInputValue(event.target.value.toString())}/>

        <FloatingActionButton mini={true} style={addButtonStyle}
                              label='Add'
                              onClick={event => {this.addAttribute(id, type)}}>
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
          editable: this.isEditable(fieldProperties, attribute) && this.canWrite(attribute)
        }

        //Add deleteButton if we can write to the attribute
        if(attributeField.editable) {
          attributeField.deleteButton = this.renderDeleteButton(this.props.entity.id, this.props.entityType, attribute);
        }

        //Add addAttributeField if the attribute is a JSON object (or not a primitive)
        if(!this.isPrimitive(attributeField.value)) {
          attributeField.addAttributeField = this.addAttributeField(this.props.entity.id, this.props.entityType, attribute);
        }

        return attributeField;
      })
    }
  }

  componentDidMount() {
    this.props.canExecuteActions(this.props.entity.id, this.props.entityType.replace('/', ''),
      recursiveKeys.dumpKeysRecursively(this.props.entity), actions);
    this.props.setInputName('');
    this.props.setInputValue('');
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
      />)
    }
  }
}

const mapStateToProps = (state) => {
  return {
    entityActionsPolicies: state.entityPolicies,
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
      setPassword: (params) => dispatch(setPassword(params)),
      setInputName: (name) => dispatch(setInputName(name)),
      setInputValue: (value) => dispatch(setInputValue(value))
    };
  };

export default connect(mapStateToProps, mapDispatchToProps)(SecurityDetails);