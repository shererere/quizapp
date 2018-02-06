import React, { Component } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import adminPage from '../AdminPage/adminpage.jsx';
import List from '../List/list.jsx';
import ListItem from '../ListItem/listitem.jsx';
import Button from '../Button/button.jsx';
import Icon from '../Icon/icon.jsx';
import styles from './style.css';

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
      listItems = this.state.quizzes.map((item, key) =>
        <ListItem key={item.id}>
          <Button icon="true" text={<Icon icon="trash" width="19" height="19" />} title="Usuń test" action={async () => {
            const confirm = window.confirm('Czy na pewno chcesz wykonać tą akcje?');
            if (confirm === true) {
              try {
                const config = Object.assign(this.axiosConfig, { data: { quizid: item.id } });
                const res = await axios.delete('/quiz', config);

                if (res.status === 200) {
                  toast('Test został usunięty!', {
                    type: 'success',
                  });
                  const { quizzes } = this.state;
                  quizzes.splice(key, 1);
                  this.setState({ quizzes });
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
            className={styles.quizName}
            onClick={() => { this.openSingleQuizPage(item.id); }}
          >
            {item.name}
          </h3>
          <span className={styles.date}>{item.created_at},</span>
          <span className={styles.count}>{item.question_count} pytań,</span>
          <span className={styles.count}>{item.user_count} użytkowników </span>
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
