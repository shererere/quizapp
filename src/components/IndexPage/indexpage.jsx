import React, { Component } from 'react';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import Header from '../Header/header.jsx';
import Menu from '../Menu/menu.jsx';
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
  }

  async callAPIEndpoints() {
    let a = [];

    try {
      const username = await axios.get(`http://localhost:3000/api/v1/user/${this.state.userid}`);
      const quizzes = await axios.get(`http://localhost:3000/api/v1/user/${this.state.userid}/quizzes`);

      a = {
        username: username.data[0].username,
        quizzes: quizzes.data,
      };
    } catch (error) {
      console.error(error);
    }

    console.log(this.state);
    return a;
  }

  componentDidMount() {
    this.callAPIEndpoints().then((response) => {
      console.log(response);

      this.setState({
        username: response.username,
        quizzes: response.quizzes,
      });
    });
  }

  render() {
    const menuItems = [
      { name: 'Ustawienia', link: '#' },
      { name: 'Wyloguj', link: '#' },
    ];
    const menuComponent = <Menu display='horizontal' items={menuItems} />;
    let quizzesComponent = null;

    if (this.state.quizzes !== null) {
      quizzesComponent = this.state.quizzes.map((quiz, index) =>
        <li className={styles.quiz} key={index}>
          <h2 className={styles.quizName}>{quiz.name}</h2>
        </li>);
    }

    return (
      <main className={styles.main}>
        <Header menu={menuComponent}/>
          <div className={styles.container}>
            <h2 className={styles.logged}>Zalogowany jako: {this.state.username}</h2>
          </div>
          <ul className={styles.quizzesList}>
            {quizzesComponent}
          </ul>
        <Footer />
      </main>
    );
  }
}
