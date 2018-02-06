import React, { Component } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Dropzone from 'react-dropzone';
import adminPage from '../AdminPage/adminpage.jsx';
import Input from '../Input/input.jsx';
import Button from '../Button/button.jsx';
import styles from './style.css';

class AdminAddQuizPage extends Component {
  constructor(props) {
    super(props);
    const token = localStorage.getItem('token');

    this.state = {
      name: '',
      size: null,
      file: new FormData(),
    };

    this.axiosConfig = {
      baseURL: 'http://localhost:3000/api/v1',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    this.handleName = this.handleName.bind(this);
    this.handleSize = this.handleSize.bind(this);
    this.handleQuestionFile = this.handleQuestionFile.bind(this);
    this.addQuiz = this.addQuiz.bind(this);
  }

  handleName(e) {
    this.setState({ name: e.target.value });
  }

  handleSize(e) {
    this.setState({ size: e.target.value });
  }

  handleQuestionFile(files) {
    this.state.file.delete('file');
    this.state.file.append('file', files[0]);
  }

  async addQuiz(e) {
    e.preventDefault();

    if (this.state.name === '' || this.state.size === null || !this.state.file.has('file')) {
      toast('Uzupełnij wszystkie pola!', {
        type: 'error',
      });
    } else {
      try {
        await axios.post('/quiz', {
          name: this.state.name,
          size: this.state.size,
        }, this.axiosConfig);

        const latest = await axios.get('/quiz/newest', this.axiosConfig);
        this.state.file.append('quizid', latest.data.id);

        axios.post('http://localhost:3000/api/v1/question/upload', this.state.file);
      } catch (error) {
        console.error(error); // eslint-disable-line no-console
        toast(`Wystąpił błąd!: ${error}`, {
          type: 'error',
        });
      } finally {
        this.props.history.push('/admin/quiz/list');

        toast('Test został dodany!', {
          type: 'success',
        });
      }
    }
  }

  render() {
    return (
      <div>
        <h2 className={styles.title}>Dodaj test</h2>
        <form>
          <Input type="text" placeholder="Nazwa" onChange={this.handleName} border="true" />
          <Input type="number" placeholder="Ilość losowanych pytań" onChange={this.handleSize} border="true" min="1" />
          {/* <Input type="file" id="file" onChange={this.handleQuestionFile} border="true" /> */}
          <Dropzone
            accept="text/csv"
            className={styles.dropzone}
            onDrop={this.handleQuestionFile}
          >
            Plik *.csv z pytaniami (kliknij, aby wybrać lub przeciągnij plik)
          </Dropzone>
          <Button text="Dodaj" action={this.addQuiz} center="true" />
        </form>
      </div>
    );
  }
}

export default adminPage(AdminAddQuizPage);
