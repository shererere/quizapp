import React, { Component } from 'react';
import axios from 'axios';
import adminPage from '../AdminPage/adminpage.jsx';
import List from '../List/list.jsx';
import ListItem from '../ListItem/listitem.jsx';
import styles from './style.css';

class AdminSingleUserPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      quizzes: [],
    };
  }

  async getUserInfo() {
    const user = await axios.get(`http://localhost:3000/api/v1/user/${this.props.match.params.id}`);
    this.setState({
      user: user.data[0],
    });
  }

  async getQuizzes() {
    const quizzes = await axios.get(`http://localhost:3000/api/v1/user/${this.props.match.params.id}/quizzes`);
    this.setState({
      quizzes: quizzes.data,
    });
  }

  componentWillMount() {
    this.getUserInfo();
    this.getQuizzes();
  }

  openUserResultPage(id) {
    this.props.history.push(`/admin/quiz/${id}/user/${this.props.match.params.id}`);
  }

  render() {
    let quizzesComponent = null;
    if (this.state.quizzes.length > 0) {
      quizzesComponent = this.state.quizzes.map((quiz) => {
        const percent = ((quiz.correct_answers * 100) / quiz.size).toFixed(1);
        const result = quiz.finished
          ? `Użytkownik ukończył test z wynikiem ${percent}%`
          : 'Użytkownik nie ukończył testu';

        return (<ListItem key={quiz.id}>
          <h3
            className={styles.quizName}
            onClick={() => { this.openUserResultPage(quiz.id); }}
          >
            {quiz.name}
          </h3>
          <span className={styles.result}>{result}</span>
        </ListItem>);
      });
    } else {
      quizzesComponent = <h3 className={styles.empty}>
        Uzytkownik jeszcze nie ma przypisanego żadnego testu ;]</h3>;
    }

    return (
      <div>
        <h2 className={styles.title}>Użytkownik: {this.state.user.username}</h2>
        <List header="Przypisane testy">
          {quizzesComponent}
        </List>
      </div>
    );
  }
}

export default adminPage(AdminSingleUserPage);
