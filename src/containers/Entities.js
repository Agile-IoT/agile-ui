import React, {Component} from 'react';
import {EntityItem} from '../components';
import {FlatButton} from 'material-ui';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {entityDelete, entityFetch} from '../actions';

class Entities extends Component {

  renderNewEntityButton() {
    return (
      <div>
        <Link to={`/add/${this.props.params.type.replace('/','')}`}>
          <FlatButton label={`Add new ${this.props.params.type.replace('/','')}`}/>
        </Link>
      </div>
    )
  }

  renderActions(entity) {
    switch (this.props.params.type) {
      case 'group':
        return (
          <div>
            <FlatButton label='Delete' onClick={() => {
              this.props.entityDelete(entity, this.props.params.type);
            }}/>
            <Link to={`/group/${entity.group_name}`}>
              <FlatButton label='View members'/>
            </Link>
          </div>
        )
      default:
        return (
          <div>
            <FlatButton label='Delete' onClick={() => {
              this.props.entityDelete(entity, this.props.params.type);
            }}/>
            <Link to={`/entity/${entity.id}/${this.props.params.type}`}>
              <FlatButton label='View'/>
            </Link>
            <Link to={`/group/${entity.id}/${this.props.params.type}`}>
              <FlatButton label='Group'/>
            </Link>
          </div>
        )
    }
  }

  renderItems() {
    if (this.props.entityList) {
      return this.props.entityList.map((entity, i) => {
        return (
          <EntityItem
            title={entity.id || entity.group_name}
            key={i}
            status={entity.status}
            actions={this.renderActions(entity)}
            meta={entity}
          />)
      });
    } else {
      return 'Entitylist is empty'
    }
  }

  componentWillMount() {
    this.props.entityFetch(this.props.params.type);
  }

  componentDidUpdate(prevProps) {
    if(prevProps.currentTab !== this.props.currentTab) {
      this.props.entityFetch(this.props.params.type);
    }
  }

  render() {
    const addnewExists = this.props.ui && this.props.ui['/' + this.props.params.type]
      && Object.keys(this.props.ui['/' + this.props.params.type]).includes('addNew');
    return (
      <div>
        {this.renderItems()}
        {(addnewExists && this.props.ui['/' + this.props.params.type].addNew) || !addnewExists ?
          this.renderNewEntityButton() : undefined}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    entityList: state.entityList,
    ui: state.schemas.ui,
    currentTab: state.currentTab
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    entityFetch: (type) => dispatch(entityFetch(type)),
    entityDelete: (entity, type) => dispatch(entityDelete(entity, type))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Entities);
