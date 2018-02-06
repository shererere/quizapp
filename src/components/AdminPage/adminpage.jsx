import React, { Component } from 'react';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import Header from '../Header/header.jsx';
import Menu from '../Menu/menu.jsx';
import styles from './style.css';

function adminPage(WrappedComponent) {
  return class extends Component {
    constructor(props) {
      super(props);
      this.token = localStorage.getItem('token');

      this.state = {
        userid: jwt.decode(this.token),
      };

      this.menuItems = [
        {
          label: 'Testy',
          submenu: [
            {
              label: 'Wszystkie testy',
              action: () => { this.props.history.push('/admin/quiz/list'); },
            },
            {
              label: 'Dodaj test',
              action: () => { this.props.history.push('/admin/quiz/add'); },
            },
            {
              label: 'Dodaj pytanie do testu',
              action: () => { this.props.history.push('/admin/quiz/question/add'); },
            },
          ],
        },
        {
          label: 'Użytkownicy',
          submenu: [
            {
              label: 'Wszyscy użytkownicy',
              action: () => { this.props.history.push('/admin/user/list'); },
            },
            {
              label: 'Dodaj użytkownika',
              action: () => { this.props.history.push('/admin/user/add'); },
            },
          ],
        },
        {
          label: 'Wyloguj',
          // action: this.logoutUser,
        },
      ];

      this.redirectIfUserIsNotLogged = this.redirectIfUserIsNotLogged.bind(this);
    }

    async redirectIfUserIsNotLogged() {
      if (localStorage.getItem('token') === null ||
          typeof localStorage.getItem('token') === 'undefined') {
        this.props.history.push('/login');
      }
    }

    logoutUser() {
      localStorage.removeItem('token');
      this.props.history.push('/login');
    }

    componentWillMount() {
      this.redirectIfUserIsNotLogged().then(() => {
        axios.get(`http://localhost:3000/api/v1/user/${this.state.userid}/admin`).then((result) => {
          if (parseInt(result.data, 10) === 0) {
            this.props.history.push('/');
          }
        });
      });
    }

    addHistoryToState(history) {
      this.setState({
        history,
      });
    }

    render() {
      return (
        <main className={styles.wrapper}>
          <nav className={styles.nav}>
            <div className={styles.logo}>
              <Header align="center" link="true" />
            </div>
            <Menu items={this.menuItems} vertical="true" />
          </nav>
          <div className={styles.content}>
            <WrappedComponent
              token={this.token}
              addHistoryToState={history => this.addHistoryToState(history)}
              logoutUser={this.logoutUser}
              redirectIfUserIsNotLogged={this.redirectIfUserIsNotLogged}
              {...this.props}
            />
          </div>
        </main>
      );
    }
  };
}

export default adminPage;
