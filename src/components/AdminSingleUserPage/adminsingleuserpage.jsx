import React, { Component } from 'react';
import axios from 'axios';
import adminPage from '../AdminPage/adminpage.jsx';
import List from '../List/list.jsx';
import ListItem from '../ListItem/listitem.jsx';

class AdminSingleUserPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      quizzes: [],
    };
  }

  async callAPIEndpoints() {
    const user = await axios.get(`http://localhost:3000/api/v1/user/${this.props.match.params.id}`);
    const quizzes = await axios.get(`http://localhost:3000/api/v1/user/${this.props.match.params.id}/quizzes`);
    this.setState({
      user: user.data[0],
      quizzes: quizzes.data,
    });
  }

  componentWillMount() {
    this.callAPIEndpoints();
  }

  openUserResultPage(id) {
    this.props.history.push(`/admin/quiz/${id}/user/${this.props.match.params.id}`);
  }

  render() {
    const quizzesComponent = this.state.quizzes.map(quiz =>
      <ListItem key={quiz.id}>
        <h3 onClick={() => { this.openUserResultPage(quiz.id); }}>{quiz.name}</h3>
        </ListItem>);

    return (
      <div> Przglądasz profil użytkownika: {this.state.user.username}
        <List header="Testy użytkownika:">
          {quizzesComponent}
        </List>
      </div>
    );
  }
}

export default adminPage(AdminSingleUserPage);
