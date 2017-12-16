import React, { Component } from 'react';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { toast } from 'react-toastify';
import Header from '../Header/header.jsx';
import Footer from '../Footer/footer.jsx';
import Question from '../Question/question.jsx';
import styles from './style.css';

export default class QuizPage extends Component {
  constructor(props) {
    super(props);
    const token = localStorage.getItem('token');

    this.state = {
      quizid: this.props.match.params.id,
      userid: jwt.decode(token),
      title: null,
      questions: null,
      usersAnswers: null,
      selectedAnswers: [],
    };

    this.logoutUser = this.logoutUser.bind(this);
    this.selectAnswer = this.selectAnswer.bind(this);
    this.solveQuiz = this.solveQuiz.bind(this);
  }

  async redirectIfUserIsNotLogged() {
    if (localStorage.getItem('token') === null || typeof localStorage.getItem('token') === 'undefined') {
      this.props.history.push('/login');
    }
  }

  // TODO: rename this function
  redirectUser() {
    if (this.state.usersAnswers.length > 0) {
      toast('Nie możesz tego zobaczyć w tym momencie!', {
        type: 'warning',
      });
      this.props.history.push('/');
    }
  }

  logoutUser() {
    localStorage.removeItem('token');
    this.props.history.push('/login');
  }

  async callAPIEndpoints() {
    try {
      const info = await axios.get(`http://localhost:3000/api/v1/quiz/${this.state.quizid}`);
      const questions = await axios.get(`http://localhost:3000/api/v1/quiz/${this.state.quizid}/questions`);
      const usersAnswers = await axios.get(`http://localhost:3000/api/v1/user/${this.state.userid}/quiz/${this.state.quizid}/answers`);

      this.setState({
        title: info.data[0].name,
        questions: questions.data,
        usersAnswers: usersAnswers.data,
      });
    } catch (error) {
      // TODO: error handling jak API będzie zwracało errory
      console.error(error);
    }
  }

  componentWillMount() {
    // TODO: to też musi być zrobione jakoś inaczej
    this.redirectIfUserIsNotLogged().then(() => {
      this.callAPIEndpoints().then(() => {
        this.redirectUser();
      });
    });
  }

  selectAnswer(id, selection) {
    const stateCopy = Object.assign({}, this.state);
    stateCopy.selectedAnswers.push({ id, selection });
    this.setState(stateCopy);
  }

  solveQuiz() {
    const stateCopy = Object.assign({}, this.state);

    // NOTE: tak btw to musi być async, żeby
    // wszystkie odpowiedzi zdążyły się wysłać zanim user zostanie przekierowany na /
    for (let i = 0; i < stateCopy.selectedAnswers.length; i += 1) {
      axios.post('http://localhost:3000/api/v1/user/quiz/answer/', {
        questionid: stateCopy.selectedAnswers[i].id,
        userid: stateCopy.userid,
        quizid: stateCopy.quizid,
        answer: stateCopy.selectedAnswers[i].selection,
      }).catch((error) => {
        // TODO: error handling jak API będzie zwracało errory
        console.log(error);
      });
    }

    toast('Odpowiedzi zostały wysłane. Zostaniesz przeniesiony na stronę główną.', {
      type: 'success',
    });
    this.props.history.push('/');
  }

  render() {
    const menuComponent = <span onClick={this.logoutUser}>logout</span>;
    let questionsComponent = null;

    if (this.state.questions !== null) {
      questionsComponent = this.state.questions.map((q, i) =>
        <Question
          id={q.id}
          question={q.content}
          answer1={q.correct_answer}
          answer2={q.wrong_answer1}
          answer3={q.wrong_answer2}
          answer4={q.wrong_answer3}
          selectAnswer={this.selectAnswer}
          key={i}
        />);
    } else if (this.state.questions === null || this.state.questions === []) {
      questionsComponent = <h3>Brak przypisanych pytań do testu</h3>;
    }

    return (
      <main className={styles.main}>
        <Header menu={menuComponent} link="true" />
        <div className={styles.wrapper}>
          <h2 className={styles.quizTitle}>Rozwiązujesz test: {this.state.title}</h2>
          <ul className={styles.questionList}>
            {questionsComponent}
          </ul>
          <button onClick={this.solveQuiz} className={styles.button}>Sprawdź odpowiedzi</button>
        </div>
        <Footer />
      </main>
    );
  }
}
