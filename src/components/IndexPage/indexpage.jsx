import React, { Component } from 'react';
import axios from 'axios';
import jwt from 'jsonwebtoken';
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
      quizzes: null,
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
      const quizzes = await axios.get(`http://localhost:3000/api/v1/user/${this.state.userid}/quizzes`);

      this.setState({
        username: username.data[0].username,
        quizzes: quizzes.data,
      });
    } catch (error) {
      console.error(error);
    }
  }

  componentDidMount() {
    this.redirectIfUserIsNotLogged().then(() => {
      this.callAPIEndpoints();
    });
  }

  render() {
    let quizzesComponent = null;

    if (this.state.quizzes !== null) {
      quizzesComponent = this.state.quizzes.map(quiz =>
        <li className={styles.quiz} key={quiz.id} onClick={() => { this.props.history.push(`/quiz/${quiz.id}`); }}>
          {quiz.name}
        </li>);
    }

    const menuComponent = <span onClick={this.logoutUser}>logout</span>;

    return (
      <main className={styles.main}>
        <Header menu={menuComponent} />
          <div className={styles.container}>
            <h2 className={styles.logged}>
              Zalogowany jako {this.state.username}. Twoje nierozwiązane testy
            </h2>
          </div>
          <ul className={styles.quizzesList}>
            {quizzesComponent}
          </ul>
        <Footer />
      </main>
    );
  }
}
