import React, {Component} from 'react';
import {connect} from 'react-redux';
import {entityFetch} from '../actions';
import {SecurityDetails} from './';

const hiddenAndDisabledAttributes = {
  notEditable: ['id', 'owner', 'name', 'type', 'auth_type'],
  hidden: ['password']
};

class Entity extends Component {

  renderEntity(entity) {
    if (entity) {
      return (<SecurityDetails
        expandable
        showExpandableButton
        key={entity.id + '_' + entity.type}
        title={entity.id}
        subtitle={entity.owner}
        entity={entity}
        entityType={'user'}
        fieldProperties={hiddenAndDisabledAttributes}
      />)
    }
    return null;
  }

  getEntity() {
    for (var i in this.props.entityList) { //Get the right entity from the entity list
      var e = this.props.entityList[i];
      if(e.id === this.props.params.id && e.type.replace('/', '') === this.props.params.type ? e : undefined)
        return e;
    }
  }

  componentWillMount() {
    this.props.entityFetch(this.props.params.type);
  }


  render() {
    var entity = this.getEntity();
    if (entity) {
      return (
        <div>
          {this.renderEntity(entity)}
        </div>
      );
    }
    return (<div>Entity data not found</div>)
  }
}

const mapStateToProps = (state) => {
  return {
    entityList: state.entityList
  };
};

const
  mapDispatchToProps = (dispatch) => {
    return {
      entityFetch: (id, type, actions) => dispatch(entityFetch(id, type, actions))
    };
  };

export default connect(mapStateToProps, mapDispatchToProps)(Entity);