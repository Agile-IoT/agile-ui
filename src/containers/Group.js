import React, {Component} from 'react';
import {connect} from 'react-redux';
import Form from 'react-jsonschema-form';
import {entityFetch, groupsFetch, addToGroup, removeFromGroup} from '../actions';

let changeGroupSchema = {
	title: 'Change group of entity',
	type: 'object',
	required: [
		'groups',
		'id',
		'type'
	],
	properties: {
		id: {
			type: 'string',
			title: 'Entity ID'
		},
		type: {
			type: 'string',
			title: 'Entity Type'
		},
		groups: {
			type: 'array',
			title: 'Groups',
			items: {
				type: 'string',
				enum: []
			}
		}
	}
};

const uiSchema = {
	id: {'ui:readonly': true},
	type: {'ui:readonly': true}
};

class Group extends Component {

  componentDidMount() {
    this.props.entityFetch(this.props.params.type);
    this.props.groupsFetch();
  }

  addToGroups(groups, entity) {
	  if(groups.length > 0) {
		  groups.forEach(group_name => {
			  let group = this.props.groups.find(group => {return group_name === group.group_name});
			  if(group) {
				  this.props.addToGroup(group.owner, group_name, entity.type.replace('/', ''), entity.id);
			  }
		  });
	  }
  }

  removeFromGroups(groups, entity) {
	  if(groups.length > 0) {
		  groups.forEach(group_name => {
			  let group = this.props.groups.find(group => {return group_name === group.group_name});
			  if(group) {
				  this.props.removeFromGroup(group.owner, group_name, entity.type.replace('/', ''), entity.id);
			  }
		  });
	  }
  }

	setGroups(entityGroups, entity) {
  	let addToGroups = [];
  	let removeFromGroups = [];
  	if(entity.groups) {
		  entityGroups.forEach(group_name => {
			  if(!entity.groups.some(group => {return group.group_name === group_name;})  // Don't try to add groups, in which the entity already is
				  && !addToGroups.some(groupname => {return group_name === groupname})) {   // Don't try to add duplicate groups
			  	addToGroups.push(group_name);
			  }
		  });

		  removeFromGroups = entity.groups.filter(group => {
			  return entityGroups.indexOf(group.group_name) === -1;
		  }).map(group => {
			  return group.group_name;
		  });
	  } else if(entityGroups.length > 0) {
  		addToGroups = entityGroups;
	  }

	  this.addToGroups(addToGroups, entity);
  	this.removeFromGroups(removeFromGroups, entity);
	}


	getGroupFormData(entity) {
		let formData = JSON.parse(JSON.stringify(entity));
		if(entity.groups) {
			formData.groups = entity.groups.map(entityGroup => {
				const group = this.props.groups.find(group => {
					return group.group_name === entityGroup.group_name;
				});
				return group ? group.group_name : undefined;
			});
		}
		return formData;
	}

  render() {
    const entity = this.props.entityList.find(entity =>
			entity.id === this.props.params.id && entity.type.replace('/', '') === this.props.params.type);

		if (entity && this.props.groups) {
			changeGroupSchema.properties.groups.items.enum = this.props.groups.map(group => {
				return group.group_name;
			});
			const formData = this.getGroupFormData(entity);
			return (
				<div>
					<Form schema={changeGroupSchema}
								uiSchema={uiSchema}
								onSubmit={event => {
									this.setGroups(event.formData.groups, entity);
								}}
								formData={formData}
								onError={event => console.log('ERROR', event)}/>
				</div>
			);
		}
    return (<div>Entity data not found</div>)
  }
}

const mapStateToProps = (state) => {
  return {
    entityList: state.entityList,
    groups: state.groups
  };
};

const
  mapDispatchToProps = (dispatch) => {
    return {
      entityFetch: (id, type, actions) => dispatch(entityFetch(id, type, actions)),
			groupsFetch: () => dispatch(groupsFetch()),
			addToGroup: (owner, groupname, type, id) => dispatch(addToGroup(owner, groupname, type, id)),
			removeFromGroup: (owner, groupname, type, id) => dispatch(removeFromGroup(owner, groupname, type, id)),

    };
  };

export default connect(mapStateToProps, mapDispatchToProps)(Group);