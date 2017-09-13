import React, {Component} from 'react';
import {EntityItem} from '../components';
import {FlatButton} from 'material-ui';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {usersDelete, entityFetch} from '../actions';

class Entities extends Component {

  renderActions(entity) {
    return (
      <div>
        <FlatButton label='Delete' onClick={() => {
          if(entity.type === '/user'){
            this.props.userDelete(entity.user_name);
          }           
        }}/>
        <Link to={`/entity/${entity.id}/${entity.type.replace('/','')}`}>
          <FlatButton label='View'/>
        </Link>
      </div>
    )
  }

  renderItems(entities) {
    if (entities) {
      return entities.map((entity, i) => {
        return (
          <EntityItem
            title={entity.id}
            key={i}
            status={entity.status}
            actions={this.renderActions(entity)}
            meta={entity}
          />)
      });
    } else {
      return 'Userlist is empty'
    }
  }

  componentWillMount() {
    this.props.entityFetch(this.props.params.type);
  }


  render() {
    return (
      <div>
        {this.renderItems(this.props.entityList)}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    entityList: state.entityList
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    entityFetch: (type) => dispatch(entityFetch(type)),
    userDelete: (user_name, auth_type) => dispatch(usersDelete(user_name, auth_type))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Entities);
