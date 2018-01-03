import React, { Component } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Input from '../Input/input.jsx';
import Button from '../Button/button.jsx';
import styles from './styles.css';

export default class AdminQuizPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quizid: this.props.quizid,
      name: null,
      size: null,
      questions: null,
      users: null,
      divisions: [],
      division: '',
    };

    this.callAPIEndpoints = this.callAPIEndpoints.bind(this);

    this.handleQuestionChange = this.handleQuestionChange.bind(this);
    this.handleCorrectAnswerChange = this.handleCorrectAnswerChange.bind(this);
    this.handleAnswer1Change = this.handleAnswer1Change.bind(this);
    this.handleAnswer2Change = this.handleAnswer2Change.bind(this);
    this.handleAnswer3Change = this.handleAnswer3Change.bind(this);
    this.handleDivisionSelect = this.handleDivisionSelect.bind(this);
    this.addQuestion = this.addQuestion.bind(this);
    this.assignUser = this.assignUser.bind(this);
    this.unassignUser = this.unassignUser.bind(this);
    this.deleteQuestion = this.deleteQuestion.bind(this);
  }

  async prefetchQuizInfo() {
    const info = await axios.get(`http://localhost:3000/api/v1/quiz/${this.state.quizid}`);
    this.setState({
      name: info.data[0].name,
      size: info.data[0].size,
    });
  }

  async callAPIEndpoints() {
    const questions = await axios.get(`http://localhost:3000/api/v1/quiz/${this.state.quizid}/questions/limit/${this.state.size}`);
    const users = await axios.get(`http://localhost:3000/api/v1/quiz/${this.state.quizid}/users/`);
    const divisions = await axios.get('http://localhost:3000/api/v1/user/division/all/');

    users.data.forEach((item, key) => {
      axios.get(`http://localhost:3000/api/v1/user/${item.id}/quiz/${this.state.quizid}/finished`)
        .then((result) => {
          console.log(result.data[0].finished);
          if (result.data[0].finished === true) {
            users.data[key].status = 'Ukończono';
          } else {
            users.data[key].status = 'Nie ukończono';
          }
        });
      delete users.data[key].created_at;
      delete users.data[key].updated_at;
      delete users.data[key].role;
    });

    questions.data.forEach((item, key) => {
      delete questions.data[key].created_at;
      delete questions.data[key].updated_at;
      delete questions.data[key].quiz_id;
    });

    this.setState({
      questions: questions.data,
      users: users.data,
      divisions: divisions.data,
    });
  }

  componentDidMount() {
    this.prefetchQuizInfo().then(() => {
      this.callAPIEndpoints();
    });
  }

  handleQuestionChange(e) {
    this.setState({
      question: e.target.value,
    });
  }
  handleCorrectAnswerChange(e) {
    this.setState({
      correct_answer: e.target.value,
    });
  }
  handleAnswer1Change(e) {
    this.setState({
      wrong_answer1: e.target.value,
    });
  }
  handleAnswer2Change(e) {
    this.setState({
      wrong_answer2: e.target.value,
    });
  }
  handleAnswer3Change(e) {
    this.setState({
      wrong_answer3: e.target.value,
    });
  }

  handleDivisionSelect(e) {
    this.setState({
      division: e.target.value,
    });
  }

  async assignUser(e) {
    e.preventDefault();

    console.log(this.props);
    const users = await axios.get(`http://localhost:3000/api/v1/user/division/${this.state.division}/`);
    users.data.forEach(async (user) => {
      await axios.post('http://localhost:3000/api/v1/quiz/assign', {
        quizid: this.state.quizid,
        userid: user.id,
      });
    });

    this.callAPIEndpoints();
  }

  addQuestion(e) {
    e.preventDefault();

    axios.post('http://localhost:3000/api/v1/question/', {
      wrong_answer1: this.state.wrong_answer1,
      wrong_answer2: this.state.wrong_answer2,
      wrong_answer3: this.state.wrong_answer3,
      correct_answer: this.state.correct_answer,
      content: this.state.question,
      quiz_id: this.state.quizid,
    }).then(() => {
      toast('Pomyślnie dodano pytanie!', {
        type: 'success',
      });
      this.callAPIEndpoints();
    }).catch((error) => {
      toast(`Błąd: ${error.message}`, {
        type: 'error',
      });
    });
  }

  unassignUser(e, userid) {
    e.preventDefault();

    console.log(userid);
    axios.delete('http://localhost:3000/api/v1/user/quiz/answers/', {
      data: {
        userid: userid,
        quizid: this.state.quizid,
      },
    }).catch((error) => {
      toast(`Błąd: ${error.message}`, {
        type: 'error',
      });
    });

    axios.delete('http://localhost:3000/api/v1/quiz/unassign/', {
      data: {
        quizid: this.state.quizid,
        userid,
      },
    }).then(() => {
      toast('Pomyślnie usunięto użytkownika!', {
        type: 'success',
      });
      this.callAPIEndpoints();
    }).catch((error) => {
      toast(`Błąd: ${error.message}`, {
        type: 'error',
      });
    });
  }

  deleteQuestion(e, questionid) {
    e.preventDefault();

    axios.delete('http://localhost:3000/api/v1/question/', {
      data: {
        id: questionid,
      },
    }).then(() => {
      toast('Pomyślnie usunięto użytkownika!', {
        type: 'success',
      });
      this.callAPIEndpoints();
    }).catch((error) => {
      toast(`Błąd: ${error.message}`, {
        type: 'error',
      });
    });
  }

  render() {
    let userListComponent = [];
    let divisionsComponent = null;
    let questionsListComponent = [];

    if (this.state.users) {
      userListComponent = this.state.users.map((user, index) =>
        <li key={index}>{user.username} --- {user.finished} --- <button onClick={(e) => { this.unassignUser(e, user.id); }}>usuń</button></li>);
    }

    if (this.state.questions) {
      questionsListComponent = this.state.questions.map((question, index) =>
      <li key={index} className={styles.list}>
        <span className={styles.question}>{question.content}</span>
        <ul>
          <li>{question.answer0}</li>
          <li>{question.answer1}</li>
          <li>{question.answer2}</li>
          <li>{question.answer3}</li>
        </ul>
        <button onClick={(e) => { this.deleteQuestion(e, question.id); }}>usuń</button>
      </li>);
    }

    if (this.state.divisions.length > 0) {
      divisionsComponent = this.state.divisions.map((d, i) =>
        <option key={i} value={d}> {d} </option>);
    }

    return (
      <div>
        <h1 className={styles.title}>{this.state.name}</h1>
        <form>
          <h2>Dodaj pytanie</h2>
          <Input border="true" type="text" placeholder="Pytanie" onChange={this.handleQuestionChange} />
          <Input border="true" type="text" placeholder="Poprawna odpowiedź" onChange={this.handleCorrectAnswerChange} />
          <Input border="true" type="text" placeholder="Błędna odpowiedź" onChange={this.handleAnswer1Change} />
          <Input border="true" type="text" placeholder="Błędna odpowiedź" onChange={this.handleAnswer2Change} />
          <Input border="true" type="text" placeholder="Błędna odpowiedź" onChange={this.handleAnswer3Change} />
          <Button text="Dodaj pytanie" action={this.addQuestion} center="true" />
        </form>
        <form>
          <h2>Przypisz test do użytkownika</h2>
          <select
            onChange={this.handleDivisionSelect}
            value={this.state.division}
          >
            <option value="" disabled>klasa</option>
            {divisionsComponent}
          </select>
          <Button text="Dodaj klasę" action={this.assignUser} center="true" />
        </form>
        <div className={styles.col_2}>
          <h2>Użytkownicy:</h2>
          {userListComponent}
        </div>
        <div className={styles.col_2}>
          <h2>Pytania:</h2>
          {questionsListComponent}
        </div>
      </div>
    );
  }
}
