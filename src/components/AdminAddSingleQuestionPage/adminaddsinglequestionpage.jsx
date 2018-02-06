import React, { Component } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { toast } from 'react-toastify';
import Dropzone from 'react-dropzone';
import Button from '../Button/button.jsx';
import Input from '../Input/input.jsx';
import adminPage from '../AdminPage/adminpage.jsx';
import styles from './style.css';

class AdminAddSingleQuestionPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: '',
      correctAnswer: '',
      wrongAnswer1: '',
      wrongAnswer2: '',
      wrongAnswer3: '',
      quizzes: [],
      selectedQuiz: '',
      file: new FormData(),
    };

    this.axiosConfig = {
      baseURL: 'http://localhost:3000/api/v1',
      headers: {
        Authorization: `Bearer ${this.props.token}`,
      },
    };

    this.handleQuestionContent = this.handleQuestionContent.bind(this);
    this.handleCorrectAnswer = this.handleCorrectAnswer.bind(this);
    this.handleWrongAnswer1 = this.handleWrongAnswer1.bind(this);
    this.handleWrongAnswer2 = this.handleWrongAnswer2.bind(this);
    this.handleWrongAnswer3 = this.handleWrongAnswer3.bind(this);
    this.handleQuestionFile = this.handleQuestionFile.bind(this);
    this.handleQuizSelect = this.handleQuizSelect.bind(this);
    this.addQuestion = this.addQuestion.bind(this);
  }

  async callAPIEndpoints() {
    const quizzes = await axios.get('http://localhost:3000/api/v1/quiz');

    this.setState({
      quizzes: quizzes.data,
    });
  }

  handleQuestionContent(e) {
    this.setState({
      content: e.target.value,
    });
  }

  handleCorrectAnswer(e) {
    this.setState({
      correctAnswer: e.target.value,
    });
  }

  handleWrongAnswer1(e) {
    this.setState({
      wrongAnswer1: e.target.value,
    });
  }

  handleWrongAnswer2(e) {
    this.setState({
      wrongAnswer2: e.target.value,
    });
  }

  handleWrongAnswer3(e) {
    this.setState({
      wrongAnswer3: e.target.value,
    });
  }

  handleQuestionFile(files) {
    this.state.file.delete('file');
    this.state.file.append('file', files[0]);
  }

  handleQuizSelect(selectedQuiz) {
    this.setState({
      selectedQuiz: selectedQuiz.value,
    });
  }

  async addQuestion(e) {
    e.preventDefault();

    if (this.state.content === '' ||
        this.state.correctAnswer === '' ||
        this.state.wrongAnswer1 === '' ||
        this.state.wrongAnswer2 === '' ||
        this.state.wrongAnswer3 === '' ||
        this.state.selectedQuiz === '') {
      toast('Uzupełnij wszystkie pola!', {
        type: 'error',
      });
    } else {
      try {
        await axios.post('/question', {
          content: this.state.content,
          correct_answer: this.state.correctAnswer,
          wrong_answer1: this.state.wrongAnswer1,
          wrong_answer2: this.state.wrongAnswer2,
          wrong_answer3: this.state.wrongAnswer3,
          quiz_id: this.state.selectedQuiz,
        }, this.axiosConfig);

        if (this.state.file.has('file')) {
          const latest = await axios.get('http://localhost:3000/api/v1/question/newest');
          this.state.file.append('questionid', latest.data.id);

          axios.post('http://localhost:3000/api/v1/question/upload', this.state.file);
        }
      } catch (error) {
        console.error(error); // eslint-disable-line no-console
        toast(`Wystąpił błąd!: ${error}`, {
          type: 'error',
        });
      } finally {
        this.props.history.push(`/admin/quiz/single/${this.state.selectedQuiz}`);

        toast('Test został dodany!', {
          type: 'success',
        });
      }
    }
  }

  componentWillMount() {
    this.callAPIEndpoints();
  }

  render() {
    let quizzes = null;

    if (this.state.quizzes.length > 0) {
      quizzes = this.state.quizzes.map((q) => { // eslint-disable-line
        return {
          value: q.id,
          label: q.name,
        };
      });
    }

    const value = this.state.selectedQuiz;

    return (
      <div>
        <h2 className={styles.title}>Dodaj pytanie do testu</h2>
        <form>
          <Input placeholder="Treść pytania" onChange={this.handleQuestionContent} border="true" />
          <Input placeholder="Poprawna odpowiedź" onChange={this.handleCorrectAnswer} border="true" />
          <Input placeholder="Błędna odpowiedź" onChange={this.handleWrongAnswer1} border="true" />
          <Input placeholder="Błędna odpowiedź" onChange={this.handleWrongAnswer2} border="true" />
          <Input placeholder="Błędna odpowiedź" onChange={this.handleWrongAnswer3} border="true" />
          <Dropzone
            accept="image/png, image/jpeg"
            className={styles.dropzone}
            onChange={this.handleQuestionFile}
          >
            Plik obrazka (opcjonalne)(kliknij, aby wybrać lub przeciągnij plik)
          </Dropzone>
          <Select
            className={styles.select}
            name="xd"
            placeholder="Test do którego ma zostać dodane pytanie"
            value={value}
            onChange={this.handleQuizSelect}
            options={quizzes}
          />
          <Button text="Dodaj pytanie" action={this.addQuestion} center="true" />
        </form>
      </div>
    );
  }
}

export default adminPage(AdminAddSingleQuestionPage);
