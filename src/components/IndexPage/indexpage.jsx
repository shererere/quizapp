import React, { Component } from 'react';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { toast } from 'react-toastify';
import Header from '../Header/header.jsx';
import Footer from '../Footer/footer.jsx';
import styles from './style.css';

export default class IndexPage extends Component {
  constructor(props) {
    super(props);

    const token = localStorage.getItem('token');

    this.state = {
      userid: jwt.decode(token),
      username: null,
      finishedQuizzes: [],
      availableQuizzes: [],
    };

    this.logoutUser = this.logoutUser.bind(this);
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

  async callAPIEndpoints() {
    try {
      const username = await axios.get(`http://localhost:3000/api/v1/user/${this.state.userid}`);
      const finishedQuizzes = await axios.get(`http://localhost:3000/api/v1/user/${this.state.userid}/quizzes/finished`);
      const availableQuizzes = await axios.get(`http://localhost:3000/api/v1/user/${this.state.userid}/quizzes/available`);

      this.setState({
        username: username.data[0].username,
        finishedQuizzes: finishedQuizzes.data,
        availableQuizzes: availableQuizzes.data,
      });
    } catch (error) {
      toast('Wystąpił błąd!', {
        type: 'error',
      });
      console.error(error); // eslint-disable-line no-console
    }
  }

  componentWillMount() {
    this.redirectIfUserIsNotLogged().then(() => {
      this.callAPIEndpoints();
    });
  }

  render() {
    let availableQuizzesComponent = null;
    let finishedQuizzesComponent = null;

    if (this.state.availableQuizzes.length > 0) {
      availableQuizzesComponent = this.state.availableQuizzes.map(quiz =>
        <li
          className={styles.quiz}
          key={quiz.id}
          history={this.props.history}
          onClick={() => { this.props.history.push(`/quiz/${quiz.id}`); }}
        >
          {quiz.name}
        </li>);
    }

    if (this.state.finishedQuizzes.length > 0) {
      finishedQuizzesComponent = this.state.finishedQuizzes.map(quiz =>
        <li
          className={styles.quiz}
          key={quiz.id}
          history={this.props.history}
          onClick={() => { toast('Nie możesz tego zobaczyć w tym momencie!', { type: 'warning' }); }}
        >
          {quiz.name}
        </li>);
    }

    const menuComponent = <span onClick={this.logoutUser}>logout</span>;

    return (
      <main className={styles.main}>
        <Header menu={menuComponent} />
          <div className={styles.container}>
            <h2 className={styles.logged}>
              Zalogowany jako {this.state.username}
            </h2>

            <h3 className={styles.subtitle}>Twoje nierozwiązane testy</h3>
            <ul className={styles.quizzesList}>
              {availableQuizzesComponent}
            </ul>

            <h3 className={styles.subtitle}>Twoje rozwiązane testy</h3>
            <ul className={styles.quizzesList}>
              {finishedQuizzesComponent}
            </ul>
          </div>
        <Footer />
      </main>
    );
  }
}
