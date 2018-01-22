import React, { Component } from 'react';
import axios from 'axios';
// import jwt from 'jsonwebtoken';
import { toast } from 'react-toastify';
import page from '../Page/page.jsx';
import Header from '../Header/header.jsx';
import Button from '../Button/button.jsx';
import Menu from '../Menu/menu.jsx';
import Footer from '../Footer/footer.jsx';
import Question from '../Question/question.jsx';
import styles from './style.css';

class QuizPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      quizid: this.props.match.params.id,
      title: null,
      questions: [],
      isFinished: null,
      selectedAnswers: [],
    };

    this.axiosConfig = {
      baseURL: 'http://localhost:3000/api/v1',
      headers: {
        Authorization: `Bearer ${this.props.token}`,
      },
    };

    this.logoutUser = this.props.logoutUser.bind(this);
    this.selectAnswer = this.selectAnswer.bind(this);
    this.solveQuiz = this.solveQuiz.bind(this);
  }

  async callAPIEndpoints() {
    try {
      const info = await axios.get(`http://localhost:3000/api/v1/quiz/${this.state.quizid}`);
      const isFinished = await axios.get(`http://localhost:3000/api/v1/user/${this.props.userid}/quiz/${this.state.quizid}/finished`);
      let questions = null;

      if (isFinished.data[0].finished === true) {
        const selectedAnswers = [];
        const usersAnswers = await axios.get(`http://localhost:3000/api/v1/user/${this.props.userid}/quiz/${this.state.quizid}/answers`);
        const correctAnswers = await axios.get(`http://localhost:3000/api/v1/user/${this.props.userid}/quiz/${this.state.quizid}/answers/correct`);
        questions = await axios.get(`http://localhost:3000/api/v1/user/${this.props.userid}/quiz/${this.state.quizid}/questions`);

        usersAnswers.data.forEach(async (a) => {
          selectedAnswers.push({ questionid: a.question_id, answer: a.answer });
        });

        this.setState({
          title: info.data[0].name,
          size: info.data[0].size,
          isFinished: isFinished.data[0].finished,
          correctAnswers: correctAnswers.data,
          selectedAnswers,
          questions: questions.data,
        });
      } else {
        questions = await axios.get(`http://localhost:3000/api/v1/quiz/${this.state.quizid}/questions/limit/${info.data[0].size}`);

        this.setState({
          title: info.data[0].name,
          size: info.data[0].size,
          isFinished: isFinished.data[0].finished,
          questions: questions.data,
        });
      }
    } catch (error) {
      toast('Wystąpił błąd!', {
        type: 'error',
      });
      // TODO: error handling jak API będzie zwracało errory
      console.error(error); // eslint-disable-line no-console
    }
  }

  componentDidMount() {
    this.props.redirectIfUserIsNotLogged().then(() => {
      this.callAPIEndpoints();
    });
  }

  selectAnswer(id, selection) {
    const stateCopy = Object.assign({}, this.state);
    const index = stateCopy.selectedAnswers.findIndex(a => a.questionid === id);
    if (index >= 0) {
      stateCopy.selectedAnswers[index].answer = selection;
    } else {
      stateCopy.selectedAnswers.push({ questionid: id, answer: selection });
    }
    this.setState(stateCopy);
  }

  async solveQuiz() {
    try {
      const stateCopy = Object.assign({}, this.state);

      stateCopy.selectedAnswers.map(async (answer, i) => {
        await axios.post('/user/quiz/answer/', {
          questionid: stateCopy.selectedAnswers[i].questionid,
          userid: this.props.userid,
          quizid: stateCopy.quizid,
          answer: stateCopy.selectedAnswers[i].answer,
        }, this.axiosConfig);
      });

      await axios.post('/user/quiz/finish', {
        userid: this.props.userid,
        quizid: this.state.quizid,
      }, this.axiosConfig);
    } catch (error) {
      toast('Wystąpił błąd!', {
        type: 'error',
      });
      console.log(error); // eslint-disable-line no-console
    }
  }

  render() {
    let titleComponent = null;
    let questionsComponent = null;
    let resultComponent = null;
    let buttonComponent = null;
    let selectedAnswer = null;

    if (this.state.isFinished) {
      const percent = Math.floor((this.state.correctAnswers / this.state.size) * 100);
      titleComponent = <h2 className={styles.quizTitle}>Przeglądasz test: {this.state.title}</h2>;
      resultComponent = <h3 className={styles.result}>Rozwiązałeś ten test na {percent}%</h3>;
    } else {
      titleComponent = <h2 className={styles.quizTitle}>Rozwiązujesz test: {this.state.title}</h2>;
      buttonComponent = <Button text="Sprawdź odpowiedzi" center="true" action={() => {
        this.solveQuiz().then(() => {
          toast('Odpowiedzi zostały wysłane. Zostaniesz przeniesiony na stronę główną.', {
            type: 'success',
          });
          this.props.history.push('/');
        });
      }} />;
    }

    if (this.state.questions !== null) {
      questionsComponent = this.state.questions.map((q, i) => {
        const index = this.state.selectedAnswers.findIndex(a => a.questionid === q.id);
        if (this.state.isFinished === true && index >= 0) {
          const selected = this.state.selectedAnswers.filter(s => s.questionid === q.id);
          selectedAnswer = selected[0].answer;
        }
        return (<Question
          id={q.id}
          quiz={this.state.quizid}
          isFinished={this.state.isFinished}
          hasImage={q.has_image}
          question={q.content}
          answer1={q.answer0}
          answer2={q.answer1}
          answer3={q.answer2}
          answer4={q.answer3}
          selectAnswer={this.selectAnswer}
          selectedAnswer={selectedAnswer}
          key={i}
       />);
      });
    } else if (this.state.questions === null || this.state.questions === []) {
      questionsComponent = <h3>Brak przypisanych pytań do testu</h3>;
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
        <Header menu={menuComponent} link="true" />
        <div className={styles.wrapper}>
          {titleComponent}
          {resultComponent}
          <ul className={styles.questionList}>
            {questionsComponent}
          </ul>
          {buttonComponent}
        </div>
        <Footer />
      </main>
    );
  }
}

export default page(QuizPage);
