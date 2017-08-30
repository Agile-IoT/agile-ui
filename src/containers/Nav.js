import { Tabs, Tab } from 'material-ui/Tabs';
import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import {fetchCurrentUser} from '../actions/index';
import {connect} from 'react-redux';

class Nav extends Component {
  handleActive(tab) {
    browserHistory.push(tab.props.value)
  }

    componentDidMount() {
        this.props.fetchCurrentUser();
    }

  render () {
    return (
      <Tabs value={this.props.location.pathname}>
        <Tab label="Discover"
        value="/"
        onActive={this.handleActive}
        >
        </Tab>
        <Tab label="Devices"
          value="/devices"
          onActive={this.handleActive}
        >
        </Tab>
        <Tab label="User profile"
             value={"/entity/" + this.props.currentUser.id + "/user"}
             onActive={this.handleActive}
        >
        </Tab>
          <Tab label="Users"
          value="/list/user"
          onActive={this.handleActive}
          >
      </Tab>
      </Tabs>
    )
  }
}

const mapStateToProps = (state) => {
    return {
        currentUser: state.currentUser,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchCurrentUser: () => dispatch(fetchCurrentUser()),

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Nav);
