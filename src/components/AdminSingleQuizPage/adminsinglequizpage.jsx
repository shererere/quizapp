import React, { Component } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { toast } from 'react-toastify';
import Dropzone from 'react-dropzone';
import '!style-loader!css-loader!react-select/dist/react-select.css'; // eslint-disable-line
// thanks sakshij ;)
import Button from '../Button/button.jsx';
import List from '../List/list.jsx';
import ListItem from '../ListItem/listitem.jsx';
import Icon from '../Icon/icon.jsx';
import adminPage from '../AdminPage/adminpage.jsx';
import styles from './style.css';

class AdminSingleQuizPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quiz: {},
      questions: {},
      users: {},
      divisions: [],
      selectedDivision: '',
      file: new FormData(),
      formStatus: 'hidden',
    };

    this.axiosConfig = {
      baseURL: 'http://localhost:3000/api/v1',
      headers: {
        Authorization: `Bearer ${this.props.token}`,
      },
    };

    this.openUserResultPage = this.openUserResultPage.bind(this);
    this.handleDivisionSelect = this.handleDivisionSelect.bind(this);
    this.assignUser = this.assignUser.bind(this);
  }

  async getQuizInfo() {
    const quiz = await axios.get(`http://localhost:3000/api/v1/quiz/${this.props.match.params.id}`);
    this.setState({ quiz: quiz.data[0] });
  }

  async getQuestions() {
    const questions = await axios.get(`http://localhost:3000/api/v1/quiz/${this.props.match.params.id}/questions`);
    this.setState({ questions: questions.data });
  }

  async getDivisions() {
    const divisions = await axios.get('http://localhost:3000/api/v1/user/division/all/');
    this.setState({ divisions: divisions.data });
  }

  async getUsers() {
    const users = await axios.get(`http://localhost:3000/api/v1/quiz/${this.props.match.params.id}/users`);
    this.setState({ users: users.data });
  }

  openUserResultPage(id) {
    this.props.history.push(`/admin/quiz/${this.state.quiz.id}/user/${id}`);
  }

  handleDivisionSelect(selectedDivision) {
    this.setState({
      selectedDivision,
    });
  }

  async assignUser(e) {
    e.preventDefault();

    const users = await axios.get(`http://localhost:3000/api/v1/user/division/${this.state.selectedDivision.value}/`);
    users.data.forEach(async (user) => {
      await axios.post('/quiz/assign', {
        quizid: this.props.match.params.id,
        userid: user.id,
      }, this.axiosConfig);
    });
  }

  componentDidMount() {
    this.getQuizInfo();
    this.getQuestions();
    this.getUsers();
    this.getDivisions();
  }

  handleQuestionImageFile(files) {
    this.state.file.delete('file');
    this.state.file.append('file', files[0]);
  }

  async uploadQuestionImage(questionid) {
    this.state.file.delete('questionid');
    this.state.file.append('questionid', questionid);
    await axios.post('http://localhost:3000/api/v1/question/upload/image', this.state.file);
  }

  render() {
    let usersListItems = null;
    let questionsListItems = null;
    let divisions = null;

    if (this.state.users.length > 0) {
      this.state.users.sort((a, b) => {
        if (a.division < b.division) return -1;
        if (a.division > b.division) return 1;
        return 0;
      });

      usersListItems = this.state.users.map((item, key) => {
        const percent = ((item.correctAnswers * 100) / this.state.quiz.size).toFixed(1);
        const result = item.finished
          ? `Użytkownik ukończył test z wynikiem ${percent}%`
          : 'Użytkownik nie ukończył testu';

        return (<ListItem key={item.id}>
          <Button icon="true" text={<Icon icon="trash" width="19" height="19" />} title="Usuń użytkownika z testu" action={async () => {
            const confirm = window.confirm('Czy na pewno chcesz wykonać tą akcje?');
            if (confirm === true) {
              try {
                const config = Object.assign(this.axiosConfig, {
                  data: {
                    userid: item.id,
                    quizid: this.props.match.params.id,
                  },
                });
                const res = await axios.delete('/quiz/unassign', config);

                if (res.status === 201) {
                  toast('Użytkownik został usunięty z testu!', {
                    type: 'success',
                  });
                  const { users } = this.state;
                  users.splice(key, 1);
                  this.setState({ users });
                }
          } catch (error) {
                console.error(error); // eslint-disable-line
                toast('Wystąpił błąd!', {
                  type: 'error',
                });
              }
            }
          }} />
          <h3
            className={styles.user}
            onClick={() => { this.openUserResultPage(item.id); }}
          >
            {item.username}
          </h3>
          <span className={styles.division}>{item.division}</span>
          <p className={styles.userResult}>{result}</p>
        </ListItem>);
      });
    } else {
      usersListItems = <h3 className={styles.empty}>Jeszcze nikt nie rozwiązuje tego testu ;]</h3>;
    }

    if (this.state.questions.length > 0) {
      questionsListItems = this.state.questions.map((item, key) => {
        const image = item.has_image === true
          ? <div className={styles.questionImage}><img style={{ maxWidth: '100%', display: 'none' }} src={`http://localhost:3000/images/${item.id}`} alt="img" /></div>
          : null;

        const showImageButton = item.has_image === true
          ? <Button small="true" text="Pokaż/ukryj obrazek" action={(e) => { e.target.parentElement.previousSibling.children[0].style.display = e.target.parentElement.previousSibling.children[0].style.display === 'none' ? 'inline-block' : 'none'; }} />
          : null;

        const addOrDeleteImageButton = item.has_image === true
          ? <Button small="true" text="Usuń obrazek" action={async () => {
            const confirm = window.confirm('Czy na pewno chcesz wykonać tą akcje?');
            if (confirm === true) {
              try {
                const config = Object.assign(this.axiosConfig, { data: { questionid: item.id } });
                const res = await axios.delete('/question/upload/image', config);

                if (res.status === 201) {
                  toast('Obrazek został usunięty!', {
                    type: 'success',
                  });
                  const { questions } = this.state;
                  questions[key].has_image = false;
                  this.setState({ questions });
                }
              } catch (error) {
                console.error(error); // eslint-disable-line
                toast('Wystąpił błąd!', {
                  type: 'error',
                });
              }
            }
          }}/>
          : <Dropzone
            accept="image/jpg, image/png"
            className={styles.dropzone}
            onDrop={(files) => {
              this.handleQuestionImageFile(files);
              this.uploadQuestionImage(item.id).then(() => {
                toast('Obrazek został dodany!', {
                  type: 'success',
                });
                const { questions } = this.state;
                questions[key].has_image = true;
                this.setState({ questions });
              });
            }}
          >
            Wyślij obrazek
          </Dropzone>;

        return (<ListItem key={item.id}>
          <Button icon="true" text={<Icon icon="trash" width="19" height="19" />} title="Usuń pytanie" action={async () => {
            const confirm = window.confirm('Czy na pewno chcesz wykonać tą akcje?');
            if (confirm === true) {
              try {
                const config = Object.assign(this.axiosConfig, { data: { id: item.id } });

                const res = await axios.delete('/question/upload/image', config);
                const res1 = await axios.delete('/question', config);

                if (res.status === 200 && res1.status === 200) {
                  const { questions } = this.state;
                  questions.splice(key, 1);
                  this.setState({
                    questions,
                  });

                  toast('Pytanie zostało usunięte!', {
                    type: 'success',
                  });
                }
              } catch (error) {
                console.error(error); // eslint-disable-line
                toast('Wystąpił błąd!', {
                  type: 'error',
                });
              }
            }
          }} />
          <h3 className={styles.question}>{item.content}</h3>
          <ul>
            <li className={styles.answer}>{item.answer0}</li>
            <li className={styles.answer}>{item.answer1}</li>
            <li className={styles.answer}>{item.answer2}</li>
            <li className={styles.answer}>{item.answer3}</li>
          </ul>
          {image}
          <div className={styles.buttonsContainer}>
            {showImageButton}
            {addOrDeleteImageButton}
          </div>
        </ListItem>);
      });
    } else {
      questionsListItems = <h3 className={styles.empty}>
        Jeszcze nikt nie dodał pytań do tego testu ;]</h3>;
    }

    if (this.state.divisions.length > 0) {
      divisions = this.state.divisions.map((d) => { // eslint-disable-line
        return {
          value: d,
          label: d,
        };
      });
    }

    const value = this.state.selectedDivision && this.state.selectedDivision.value;

    return (
      <div>
        <h2 className={styles.quizName}>Nazwa testu: {this.state.quiz.name}</h2>
        <div className={styles.col_2}>
          <List header="Lista pytań">
            {questionsListItems}
          </List>
        </div>
        <div className={styles.col_2}>
          <List header="Użytkownicy przypisani do testu">
            {usersListItems}
            <Button center="true" text="Przypisz klasę do testu" action={(e) => {
              if (this.state.formStatus === 'hidden') {
                e.target.nextSibling.style.display = 'block';
                this.setState({
                  formStatus: 'visible',
                });
              } else if (this.state.formStatus === 'visible') {
                e.target.nextSibling.style.display = 'none';
                this.setState({
                  formStatus: 'hidden',
                });
              }
            }} />
            <form className={styles.divisionForm}>
              <Select
                className={styles.select}
                name="xd"
                placeholder="Wybierz klasę z listy"
                value={value}
                onChange={this.handleDivisionSelect}
                options={divisions}
              />
              <Button text="Przypisz wybraną klasę" action={this.assignUser} center="true" />
            </form>
          </List>
        </div>
      </div>
    );
  }
}

export default adminPage(AdminSingleQuizPage);
