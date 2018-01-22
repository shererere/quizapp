import React, { Component } from 'react';
import axios from 'axios';
import Select from 'react-select';
import '!style-loader!css-loader!react-select/dist/react-select.css'; // eslint-disable-line
// thanks sakshij ;)
import Button from '../Button/button.jsx';
import List from '../List/list.jsx';
import ListItem from '../ListItem/listitem.jsx';
import adminPage from '../AdminPage/adminpage.jsx';
import styles from './style.css';

class AdminSingleQuizPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quiz: {},
      questions: {},
      users: {},
      usersResults: [],
      divisions: [],
      selectedDivision: '',
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
    this.updateUsersState = this.updateUsersState.bind(this);
  }

  async callAPIEndpoints() {
    const quiz = await axios.get(`http://localhost:3000/api/v1/quiz/${this.props.match.params.id}`);
    const questions = await axios.get(`http://localhost:3000/api/v1/quiz/${this.props.match.params.id}/questions`);
    const divisions = await axios.get('http://localhost:3000/api/v1/user/division/all/');
    const users = await axios.get(`http://localhost:3000/api/v1/quiz/${this.props.match.params.id}/users`);

    this.setState({
      quiz: quiz.data[0],
      questions: questions.data,
      users: users.data,
      divisions: divisions.data,
    });
  }

  async updateUsersState() {
    const { users } = this.state;
    const usersResults = [];
    users.forEach(async (item) => {
      const finished = await axios.get(`http://localhost:3000/api/v1/user/${item.id}/quiz/${this.props.match.params.id}/finished`);
      if (finished.data[0].finished === true) {
        const correctAnswers = await axios.get(`http://localhost:3000/api/v1/user/${item.id}/quiz/${this.props.match.params.id}/answers/correct`);
        usersResults.push({
          userid: item.id,
          finished: true,
          correctAnswers: correctAnswers.data,
        });
      } else {
        usersResults.push({
          userid: item.id,
          finished: false,
        });
      }
    });
    this.setState({
      usersResults,
    });
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
    this.callAPIEndpoints().then(() => {
      this.updateUsersState();
    });
  }

  render() {
    let usersListItems = null;
    let questionsListItems = null;
    let divisions = null;
    const { usersResults } = this.state;

    if (this.state.users.length > 0) {
      usersListItems = this.state.users.map((item) => {
        const userResult = usersResults.filter(result => result.userid === item.id);
        const result = userResult.finished === true
          ? 'nie fiut'
          : 'fiut';

        return (<ListItem key={item.id}>
          <h3 onClick={() => { this.openUserResultPage(item.id); }}>{item.username}</h3>
          {result}
        </ListItem>);
      });
    }

    if (this.state.questions.length > 0) {
      questionsListItems = this.state.questions.map(item =>
        <ListItem key={item.id}>
          <h3 onClick={() => { this.openUserResultPage(item.id); }}>{item.content}</h3>
          <ul>
            <li>{item.answer0}</li>
            <li>{item.answer1}</li>
            <li>{item.answer2}</li>
            <li>{item.answer3}</li>
          </ul>
        </ListItem>);
    }

    if (this.state.divisions.length > 0) {
      divisions = this.state.divisions.map((d) => { // eslint-disable-line
        return {
          value: d,
          label: d,
        };
      });
    }

    // NOTE: no idea czemu tak, ale tak było w przykładzie
    // NOTE 2: nadal nie wiem ale zedytowałem to z przykładu i działa
    const value = this.state.selectedDivision && this.state.selectedDivision.value;

    return (
      <div>
        <h2>Nazwa testu: {this.state.quiz.name}</h2>
        <div className={styles.col_2}>
          <h1>Pytania</h1>
          <Button center="true" text="Placeholder xd" />
          <List header="Lista pytań">
            {questionsListItems}
          </List>
        </div>
        <div className={styles.col_2}>
          <h1>Użytkownicy</h1>
          <Button center="true" text="Przypisz klasę do testu" />
          {/* TODO: zrobić ładne chowanko i pokazywanko formularza */}
          {/* NOTE: przy robieniu chowanka i naprawianiu fiuta
                    prosze dodać wypierdalanko userów z testu */}
          <form>
            <Select
              className={styles.select}
              name="xd"
              value={value}
              onChange={this.handleDivisionSelect}
              options={divisions}
            />
            <Button text="Przypisz wybraną klasę" action={this.assignUser} center="true" />
          </form>
          <List header="Użytkownicy przypisani do testu">
            {usersListItems}
          </List>
        </div>
      </div>
    );
  }
}

export default adminPage(AdminSingleQuizPage);
