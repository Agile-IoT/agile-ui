import React, {Component} from 'react';
import {List, ListItem} from 'material-ui/List';
import InlineEdit from 'react-edit-inline';
import {setEntityData, deleteAttribute, canExecuteActions} from '../actions';
import {connect} from 'react-redux';
import { FloatingActionButton } from 'material-ui';

import ContentRemove from 'material-ui/svg-icons/content/remove';
import ContentAdd from 'material-ui/svg-icons/content/add';

import SecurityItem from '../components/SecurityItem';
import {setPassword} from '../actions/index';

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
  position: 'absolute'
};


const actions = {write: ['delete', 'edit', 'add']};

const weight = function (attr, fieldProperties) {
  if (fieldProperties.notEditable.indexOf(attr)<0){
    return 0;
  }
  else if (this.isPrimitive(attr)){
    return 1;
  }
  else if (this.isPrimitive(attr) && !this.canWrite(attr)){
    return 1;
  }
  else if (this.isPrimitive(attr) && this.canWrite(attr)){
    return 2;
  }
  else if (!this.isPrimitive(attr) && !this.canWrite(attr)){
    return 3;
  }
  else if (!this.isPrimitive(attr) && this.canWrite(attr)){
    return 4;
  }
  else {
    return 5;
  }
}

class SecurityDetails extends Component {

  getAttributeNames = (entity) => {
    var attributeList = [];
    for (var attribute in entity) {
      if (entity.hasOwnProperty(attribute)) {
        attributeList.push(attribute);
        if (entity[attribute] instanceof Object) {
          var sublist = this.getAttributeNames(entity[attribute]);
          for (var i in sublist) {
            attributeList.push(attribute + '.' + sublist[i]);
          }
        }
      }
    }
    return attributeList;
  }

  canWrite(attribute) {
    attribute = attribute ? attribute : 'actions.self';
    return (this.props.entityActionsPolicies.policies
      && this.props.entityActionsPolicies.policies[attribute]
      && this.props.entityActionsPolicies.policies[attribute].write)

  }

  canRead(attribute) {
    attribute = attribute ? attribute : 'actions.self';
    return (this.props.entityActionsPolicies.policies
      && this.props.entityActionsPolicies.policies[attribute]
      && this.props.entityActionsPolicies.policies[attribute].read)
  }

  getDeleteButton(params) {
    return (
      <FloatingActionButton mini={true}  id={'delete_' + params.id + '_' + params.attribute}
                    key={params.id + '_' + params.attribute}
                    style={deleteButtonStyle}
                    label='Delete'
                    onClick={() => {
                      this.props.deleteAttribute(params)
                    }}>
            <ContentRemove />
      </FloatingActionButton>
    )
  }

  getAddAttributeFields(parent) {
    if (this.canWrite(parent)) {
      var newAttribute = {};
      var attributeName = parent ? parent + 'newAttr' : 'newAttr';
      var attributeValue = parent ? parent + 'newAttrVal' : 'newAttrVal';
      return (
        <div>
          <input onFocus={(event) => {
            event.stopPropagation()
          }} onClick={(event) => {
            event.stopPropagation()
          }}
                 id={attributeName} placeholder='New Attribute'/>
          <input onFocus={(event) => {
            event.stopPropagation()
          }} onClick={(event) => {
            event.stopPropagation()
          }}
                 id={attributeValue} placeholder='Value'/>
           <FloatingActionButton mini={true}  style={addButtonStyle}
                         label='Add'
                         onClick={(event) => {
                           event.stopPropagation();
                           if (parent) {
                             newAttribute[parent + '.' + document.getElementById(attributeName).value] =
                               document.getElementById(attributeValue).value;
                           } else {
                             newAttribute[document.getElementById(attributeName).value] =
                               document.getElementById(attributeValue).value;
                           }
                           this.dataChanged(this.props.entity.id, this.props.entityType.replace('/', ''), newAttribute);
                           document.getElementById(attributeName).value = '';
                           document.getElementById(attributeValue).value = '';
                         }}>
                       <ContentAdd />
          </FloatingActionButton>

        </div>
      )
    }
    return null;
  }

  isAdmin(id) {
    for (var i in this.props.entityList) { //Get the right entity from the entity list
      var e = this.props.entityList[i];
      if(e.id === id && e.type.replace('/', '') === 'user' ? e : undefined)
        return e.role === 'admin';
    }
    return false;
  }

  renderAttributeActions(id, type, attribute) {
    var actionButtons = [];
    if (this.canWrite(attribute)) {
      actionButtons.push(this.getDeleteButton({id: id, type: type, attribute: attribute}));
    }
    return (<div>{actionButtons}</div>);
  }

  dataChanged(id, type, data) {
    var params = {};
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
    this.props.setEntityAttributes(params);
  }

  customValidateText(text) {
    return (text.length > 0);

  }

  isPrimitive(object) {
    return typeof object !== 'object';
  }

  stringifyDetail(value, attribute, event) {
    event.stopPropagation();
    if (!this.isPrimitive(value)) {
      var checkExist = setInterval(function () {
        if (document.getElementsByClassName('editing').length) {
          document.getElementsByClassName('editing')[0].value = JSON.stringify(value);
          clearInterval(checkExist);
        }
      }, 50)
    }
  }



  renderDetails(meta, id, fieldProperties, parent) {

    if (meta) {
      var addAttribute = this.canWrite(parent) ? (<ListItem>{this.getAddAttributeFields(parent)}</ListItem>) : null;
      var sortedAttributes = Object.keys(meta);
      sortedAttributes = sortedAttributes.filter((attr) => {
        return fieldProperties.hidden.indexOf(attr)<0;
      })
      sortedAttributes = sortedAttributes.sort((attr1, attr2) =>{
        return  weight.bind(this)(attr2, fieldProperties) - weight.bind(this)(attr1, fieldProperties);
      })
      return (<List>{

        sortedAttributes.map((k) => {
        var attribute = k;
        if (parent) {
          attribute = parent + '.' + k;
        }

        if (fieldProperties && fieldProperties.hidden && fieldProperties.hidden.indexOf(attribute) === -1) {
          if (!this.canWrite(attribute) || (fieldProperties && fieldProperties.notEditable && fieldProperties.notEditable.indexOf(attribute) !== -1)) {
            return (
              <ListItem id={attribute} key={`${id}${k}${meta[k]}`}>
                {k}: <div className='notEditable'>{ this.isPrimitive(meta[k]) ? meta[k] :
                  this.renderDetails(meta[k], id, fieldProperties, attribute) }
                </div>
              </ListItem>
            )
          } else {
            return (
              <ListItem id={attribute} onClick={this.stringifyDetail.bind(this, meta[k], attribute)}
                        key={`${id}${k}${meta[k]}`}>
                {k}: <InlineEdit activeClassName='editing'
                                 validate={this.customValidateText}
                                 text={ this.isPrimitive(meta[k]) ? meta[k] :
                                   this.renderDetails(meta[k], id, fieldProperties, attribute) }
                                 change={this.dataChanged.bind(this, id, this.props.entityType.replace('/', ''))}
                                 paramName={attribute}
              />
                {
                  this.renderAttributeActions(id, this.props.entityType.replace('/', ''), attribute)
                }
              </ListItem>

            )
          }
        }
        return null;
      })}
        {addAttribute}
      </List>)
    }
  }

  componentDidMount() {
    this.props.canExecuteActions(this.props.entity.id, this.props.entityType.replace('/', ''), this.getAttributeNames(this.props.entity), actions)
  }

  render() {
    var entity = this.props.entity;
    if (entity && this.props.entityActionsPolicies) {
      var details = this.renderDetails(entity, entity.id, this.props.fieldProperties);
      return (<SecurityItem
        expandable
        showExpandableButton
        key={entity.id + '_' + this.props.entityType}
        title={this.props.title}
        subtitle={this.props.subtitle}
        details={details}
      />)
    }
  }
}

const mapStateToProps = (state) => {
  return {
    entityActionsPolicies: state.entityPolicies,
    currentUser: state.currentUser,
    entityList: state.entityList
  };
};

const
  mapDispatchToProps = (dispatch) => {
    return {
      setEntityAttributes: (params) => dispatch(setEntityData(params)),
      deleteAttribute: (params) => dispatch(deleteAttribute(params)),
      canExecuteActions: (id, type, attributes, actions) => dispatch(canExecuteActions(id, type, attributes, actions)),
      setPassword: (params) => dispatch(setPassword(params))
    };
  };

export default connect(mapStateToProps, mapDispatchToProps)(SecurityDetails);
