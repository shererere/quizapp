import React, { Component } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Icon from '../Icon/icon.jsx';
import styles from './style.css';

export default class UsersList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      quizid: this.props.quizid,
      division: this.props.division,
      users: [],
    };

    this.deleteUser = this.deleteUser.bind(this);
    this.assignUserToQuiz = this.assignUserToQuiz.bind(this);
  }

  async getUsers() {
    const users = await axios.get('http://localhost:3000/api/v1/user');
    this.setState({
      users: users.data,
    });
  }

  componentDidMount() {
    this.getUsers();
  }

  deleteUser(userid) {
    axios.delete('http://localhost:3000/api/v1/user/', {
      data: {
        userid,
      },
    }).then(() => {
      this.getUsers();
      toast('Użytkownik został usunięty pomyślnie.', {
        type: 'success',
      });
    }).catch((error) => {
      toast(`Błąd: ${error.message}`, {
        type: 'error',
      });
    });
  }

  assignUserToQuiz(userid) {
    console.log(this.props);
    console.log(userid);
  }

  render() {
    let usersComponent = null;
    if (this.state.users.length > 0) {
      usersComponent = this.state.users.map(user =>
        <li key={user.id} className={styles.item}>
          {user.username} --- {user.division}
          <div className={styles.menuWrapper}>
            <span onClick={() => { this.assignUserToQuiz(user.id); }}>
              <Icon icon="plus" width="24px" height="24px" fillcolor="black" />
            </span>
            <span onClick={() => { this.deleteUser(user.id); }}>
              <Icon icon="trash" width="24px" height="24px" fillcolor="black" />
            </span>
          </div>
        </li>);
    }

    return (
      <ul>
        {usersComponent}
      </ul>
    );
  }
}
