import React, { Component } from 'react';
import axios from 'axios';
import adminPage from '../AdminPage/adminpage.jsx';
import List from '../List/list.jsx';
import ListItem from '../ListItem/listitem.jsx';

class AdminQuizzesListPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      quizzes: [],
    };

    this.axiosConfig = {
      baseURL: 'http://localhost:3000/api/v1',
      headers: {
        Authorization: `Bearer ${this.props.token}`,
      },
    };

    this.openSingleQuizPage = this.openSingleQuizPage.bind(this);
  }

  async callAPIEndpoints() {
    const quizzes = await axios.get('/quiz', this.axiosConfig);
    this.setState({
      quizzes: quizzes.data,
    });
  }

  componentWillMount() {
    this.callAPIEndpoints();
  }

  openSingleQuizPage(id) {
    this.props.history.push(`/admin/quiz/single/${id}`);
  }

  render() {
    let listItems = null;

    if (this.state.quizzes.length > 0) {
      listItems = this.state.quizzes.map(item =>
        <ListItem key={item.id}>
          <h3 onClick={() => { this.openSingleQuizPage(item.id); }}>{item.name}</h3>
        </ListItem>);
    }

    return (
      <div>
        <List header="Lista testów">
          {listItems}
        </List>
      </div>
    );
  }
}

export default adminPage(AdminQuizzesListPage);
