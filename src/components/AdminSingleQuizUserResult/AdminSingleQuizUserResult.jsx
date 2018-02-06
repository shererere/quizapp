import React, { Component } from 'react';
import axios from 'axios';
import List from '../List/list.jsx';
import ListItem from '../ListItem/listitem.jsx';
import adminPage from '../AdminPage/adminpage.jsx';
import styles from './style.css';

class AdminSingleQuizUserResult extends Component {
  constructor(props) {
    super(props);

    this.state = {
      quiz: {},
      user: {},
      answers: [],
      questions: [],
      correctAnswers: 0,
    };
  }

  async callAPIEndpoints() {
    const quiz = await axios.get(`http://localhost:3000/api/v1/quiz/${this.props.match.params.quizid}`);
    const user = await axios.get(`http://localhost:3000/api/v1/user/${this.props.match.params.userid}`);
    const answers = await axios.get(`http://localhost:3000/api/v1/user/${this.props.match.params.userid}/quiz/${this.props.match.params.quizid}/answers`);
    const questions = await axios.get(`http://localhost:3000/api/v1/user/${this.props.match.params.userid}/quiz/${this.props.match.params.quizid}/questions`);
    const correctAnswers = await axios.get(`http://localhost:3000/api/v1/user/${this.props.match.params.userid}/quiz/${this.props.match.params.quizid}/answers/correct`);
    this.setState({
      quiz: quiz.data[0],
      user: user.data[0],
      answers: answers.data,
      questions: questions.data,
      correctAnswers: correctAnswers.data,
    });
  }

  componentWillMount() {
    this.callAPIEndpoints();
  }

  render() {
    const percent = parseInt((this.state.correctAnswers / this.state.quiz.size) * 100, 10);
    const questionsListComponent = this.state.questions.map((question) => {
      const index = this.state.answers.findIndex(answer => answer.question_id === question.id);
      const answerIndex = this.state.answers[index].answer;
      const userAnswer = question[`answer${answerIndex}`];
      const color = answerIndex === '0' ? 'green' : 'red';

      return (<ListItem key={question.id} color={color}>
        <ul>
          <li className={styles.question}>{question.content}</li>
          <li className={styles.answer}>Poprawna odpowiedź: {question.answer0}</li>
          <li className={styles.answer}>Odpowiedź użytkownika: {userAnswer}</li>
        </ul>
      </ListItem>);
    });

    return (
      <div>
        <h2 className={styles.title}>
          Użytkownik
          <span className={styles.a}>{this.state.user.username}</span>
          zdobył
          <span className={styles.a}>{percent.toString()}</span>
          procent poprawnych odpowiedzi w quizie o nazwie
          <span className={styles.a}>{this.state.quiz.name}</span>
        </h2>
        <List header="Odpowiedzi">
          {questionsListComponent}
        </List>
      </div>
    );
  }
}

export default adminPage(AdminSingleQuizUserResult);
