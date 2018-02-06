import React, { Component } from 'react';
import jwt from 'jsonwebtoken';
import Header from '../Header/header.jsx';
import Menu from '../Menu/menu.jsx';
import Footer from '../Footer/footer.jsx';
import styles from './style.css';

export default function page(WrappedComponent) {
  return class extends Component {
    constructor(props) {
      super(props);
      this.token = localStorage.getItem('token');

      this.state = {
        userid: jwt.decode(this.token),
      };

      this.menuItems = [
        {
          label: 'Zmień hasło',
          action: () => {
            this.props.history.push('/password');
          },
        },
        {
          label: 'Wyloguj',
          action: this.logoutUser.bind(this),
        },
      ];

      // this.logoutUser = this.logoutUser.bind(this);
    }

    async redirectIfUserIsNotLogged(history) {
      if (localStorage.getItem('token') === null || typeof localStorage.getItem('token') === 'undefined') {
        history.push('/login');
      }
    }

    logoutUser() {
      localStorage.removeItem('token');
      this.props.history.push('/login');
    }

    render() {
      const menuComponent = <Menu items={this.menuItems} fix="false" align="right" />;

      return (
        <div className={styles.wrapper}>
          <Header menu={menuComponent} link="true" />
          <WrappedComponent
            token={this.token}
            userid={this.state.userid}
            logoutUser={this.logoutUser}
            redirectIfUserIsNotLogged={this.redirectIfUserIsNotLogged}
            {...this.props}
            />
          <Footer />
        </div>
      );
    }
  };
}
