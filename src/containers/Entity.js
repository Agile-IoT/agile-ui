import React, {Component} from 'react';
import {connect} from 'react-redux';
import {entityFetch} from '../actions';
import {SecurityDetails} from './';

class Entity extends Component {

  renderEntity(entity) {
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

  componentWillMount() {
    this.props.entityFetch(this.props.params.type);
  }

  render() {
    const {id, type} = this.props.params

    const relevantEntity = this.props.entityList.find(entity =>
      entity.id === id && entity.type.replace('/', '') === type);

    if (relevantEntity) {
      return (
        <div> {this.renderEntity(relevantEntity)} </div>
      );
    }

    return (<div> No Entity data was found </div>)
  }
}

const mapStateToProps = state => {
  return {
    entityList: state.entityList,
    schemas: state.schemas
  };
};

const
  mapDispatchToProps = dispatch => {
    return {
      entityFetch: (id, type, actions) => dispatch(entityFetch(id, type, actions))
    };
  };

export default connect(mapStateToProps, mapDispatchToProps)(Entity);
