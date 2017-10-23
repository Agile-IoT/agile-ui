import React, {Component} from 'react';
import {connect} from 'react-redux';
import {groupsFetch} from '../actions';
import EntityItem from "../components/EntityItem";

class GroupMembers extends Component {

  render() {
    const group = this.props.groups.find(group => group.group_name === this.props.params.group_name);
    if (group && group.entities) {
      return (
        <EntityItem
        title={group.group_name}
        text={group.entities.map(entity => {return JSON.stringify(entity)})}
        />
      );
    }
    return (<div>No group members</div>)
  }

  componentWillMount() {
    this.props.groupsFetch();
  }
}

const mapStateToProps = (state) => {
  return {
    groups: state.groups
  };
};

const
  mapDispatchToProps = (dispatch) => {
    return {
      groupsFetch: () => dispatch(groupsFetch())
    };
  };

export default connect(mapStateToProps, mapDispatchToProps)(GroupMembers);