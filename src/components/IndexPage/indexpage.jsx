import React, { Component } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import page from '../Page/page.jsx';
import Header from '../Header/header.jsx';
import Menu from '../Menu/menu.jsx';
import Footer from '../Footer/footer.jsx';
import styles from './style.css';

class IndexPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: null,
      finishedQuizzes: [],
      availableQuizzes: [],
    };

    this.logoutUser = this.props.logoutUser.bind(this);
  }

  async callAPIEndpoints() {
    try {
      const username = await axios.get(`http://localhost:3000/api/v1/user/${this.props.userid}`);
      const finishedQuizzes = await axios.get(`http://localhost:3000/api/v1/user/${this.props.userid}/quizzes/finished`);
      const availableQuizzes = await axios.get(`http://localhost:3000/api/v1/user/${this.props.userid}/quizzes/available`);

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

  // TODO: no idea czy `did` czy `will`
  componentDidMount() {
    this.props.redirectIfUserIsNotLogged().then(() => {
      this.callAPIEndpoints();
    });
  }

  async handleQuizPermission(quizId) {
    const solvingUsers = await axios.get(`http://localhost:3000/api/v1/quiz/${quizId}/users/solving`);
    const isFinished = await axios.get(`http://localhost:3000/api/v1/user/${this.props.userid}/quiz/${quizId}/finished`);

    if (isFinished.data[0].finished === true && solvingUsers.data.length !== 0) {
      toast('Nie możesz tego zobaczyć w tym momencie!', { type: 'warning' });
    } else {
      this.props.history.push(`/quiz/${quizId}`);
    }
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
          onClick={() => this.handleQuizPermission(quiz.id)}
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
          onClick={() => this.handleQuizPermission(quiz.id)}
        >
          {quiz.name}
        </li>);
    }

    const menuItems = [
      {
        label: 'Wyloguj',
        action: this.logoutUser,
      },
    ];
    const menuComponent = <Menu items={menuItems} fix="false" align="right" />;

    return (
      <main className={styles.main}>
        <Header menu={menuComponent} />
          <div className={styles.wrapper}>
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

export default page(IndexPage);
