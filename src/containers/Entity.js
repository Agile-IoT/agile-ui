import React, {Component} from 'react';
import {connect} from 'react-redux';
import {entityFetch} from '../actions';
import {SecurityDetails} from './';

class Entity extends Component {

  renderEntity(entity) {
    if (entity) {
      const fieldProperties = this.props.schemas.ui && this.props.schemas.ui[entity.type] ? this.props.schemas.ui[entity.type].attributes : {};
      return (<SecurityDetails
        expandable
        showExpandableButton
        key={entity.id + '_' + entity.type}
        title={entity.id}
        subtitle={entity.owner}
        entity={entity}
        entityType={entity.type}
        fieldProperties={fieldProperties}
      />)
    }
    return null;
  }

  componentWillMount() {
    this.props.entityFetch(this.props.params.type);
  }

  render() {
    let entity = this.props.entityList.find(entity => entity.id === this.props.params.id && entity.type.replace('/', '') === this.props.params.type);

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
    entityList: state.entityList,
    schemas: state.schemas
  };
};

const
  mapDispatchToProps = (dispatch) => {
    return {
      entityFetch: (id, type, actions) => dispatch(entityFetch(id, type, actions))
    };
  };

export default connect(mapStateToProps, mapDispatchToProps)(Entity);