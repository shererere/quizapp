import React, { Component } from 'react';
import jwt from 'jsonwebtoken';

export default function page(WrappedComponent) {
  return class extends Component {
    constructor(props) {
      super(props);
      this.token = localStorage.getItem('token');

      this.state = {
        userid: jwt.decode(this.token),
      };
    }

    async redirectIfUserIsNotLogged() {
      if (localStorage.getItem('token') === null || typeof localStorage.getItem('token') === 'undefined') {
        this.props.history.push('/login');
      }
    }

    logoutUser() {
      localStorage.removeItem('token');
      this.props.history.push('/login');
    }

    render() {
      return (
        <WrappedComponent
          token={this.token}
          userid={this.state.userid}
          logoutUser={this.logoutUser}
          toggleLoading={this.toggleLoading}
          redirectIfUserIsNotLogged={this.redirectIfUserIsNotLogged}
          {...this.props}
        />
      );
    }
  };
}

