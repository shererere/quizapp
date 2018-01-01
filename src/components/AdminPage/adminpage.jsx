import React, { Component } from 'react';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import Header from '../Header/header.jsx';
import Menu from '../Menu/menu.jsx';
import AdminQuizzesPage from '../AdminQuizzesPage/AdminQuizzesPage.jsx';
import AdminUsersPage from '../AdminUsersPage/AdminUsersPage.jsx';
import styles from './style.css';

export default class AdminPage extends Component {
  constructor(props) {
    super(props);

    const token = localStorage.getItem('token');

    this.state = {
      userid: jwt.decode(token),
      current: null,
    };

    this.showQuizzes = this.showQuizzes.bind(this);
    this.showUsers = this.showUsers.bind(this);
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

  showQuizzes() {
    this.setState({ current: 'quizzes' });
  }

  showUsers() {
    this.setState({ current: 'users' });
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

  render() {
    // const list = this.state.current === 'users' ? this.state.users : this.state.quizzes;
    // let listComponent = null;

    // if (list.length > 0) {
    //   listComponent = list.map(item =>
    //     <li
    //       className={styles.listItem}
    //       key={item.id}
    //     >
    //       { typeof item.name !== 'undefined' ? item.name : item.username }
    //     </li>);
    // }

    const menuItems = [
      {
        label: 'Quizy',
        action: this.showQuizzes,
      },
      {
        label: 'Użytkownicy',
        action: this.showUsers,
      },
      {
        label: 'Wyloguj',
        action: this.logoutUser,
      },
    ];

    const component = this.state.current === 'users' ? <AdminUsersPage /> : <AdminQuizzesPage />;

    return (
      <main className={styles.wrapper}>
        <nav className={styles.nav}>
          <Header align="center" link="true" />
          <Menu items={menuItems} vertical="true" />
        </nav>
        <div className={styles.content}>
          {component}
        </div>
      </main>
    );
  }
}
