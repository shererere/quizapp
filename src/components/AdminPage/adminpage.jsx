import React, { Component } from 'react';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import Header from '../Header/header.jsx';
import Menu from '../Menu/menu.jsx';
import AdminQuizzesPage from '../AdminQuizzesPage/AdminQuizzesPage.jsx';
import AdminUsersPage from '../AdminUsersPage/AdminUsersPage.jsx';
import AdminQuizPage from '../AdminQuizPage/adminquizpage.jsx';
import AddUser from '../AddUser/adduser.jsx';
import AddQuiz from '../AddQuiz/addquiz.jsx';
import styles from './style.css';

export default class AdminPage extends Component {
  constructor(props) {
    super(props);

    const token = localStorage.getItem('token');

    this.state = {
      userid: jwt.decode(token),
      current: null,
      quizid: '',
    };

    this.showQuizzes = this.showQuizzes.bind(this);
    this.showUsers = this.showUsers.bind(this);
    this.showNewUserForm = this.showNewUserForm.bind(this);
    this.showNewQuizForm = this.showNewQuizForm.bind(this);
    this.switchPage = this.switchPage.bind(this);
    this.changeId = this.changeId.bind(this);
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

  showNewUserForm() {
    this.setState({ current: 'newUserForm' });
  }

  showNewQuizForm() {
    this.setState({ current: 'newQuizForm' });
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

  changeId(quizid) {
    console.log(quizid);
    this.setState({
      quizid,
      current: 'quiz',
    });
  }

  switchPage(page, id = null) {
    let component = null;

    switch (page) {
      case 'users':
        component = <AdminUsersPage />;
        break;
      case 'quizzes':
        component = <AdminQuizzesPage changeId={this.changeId} />;
        break;
      case 'newUserForm':
        component = <AddUser />;
        break;
      case 'newQuizForm':
        component = <AddQuiz />;
        break;
      case 'quiz':
        component = <AdminQuizPage quizid={id} />;
        break;
      default:
        component = <h1>Witam w panelu administracyjnym</h1>;
        break;
    }

    return component;
  }

  render() {
    const menuItems = [
      {
        label: 'Testy',
        submenu: [
          {
            label: 'Wszystkie testy',
            action: this.showQuizzes,
          },
          {
            label: 'Dodaj test',
            action: this.showNewQuizForm,
          },
        ],
      },
      {
        label: 'Użytkownicy',
        submenu: [
          {
            label: 'Wszyscy użytkownicy',
            action: this.showUsers,
          },
          {
            label: 'Dodaj użytkownika',
            action: this.showNewUserForm,
          },
        ],
      },
      {
        label: 'Wyloguj',
        action: this.logoutUser,
      },
    ];

    const component = this.switchPage(this.state.current, this.state.quizid);

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
